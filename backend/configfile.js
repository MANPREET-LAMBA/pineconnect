const appx = require("./websitehttp/server");
const http = require("http");
const cors = require("cors");
const licenseModel = require("./websitehttp/schema/licenseSchema");
const express = require("express");
const net = require("net");

appx.use(cors());
appx.use(express.json());
appx.use(express.urlencoded({ extended: true }));

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const PORT = 9001;

const activeLicenses = new Map();

// --------------------
// Helper Functions
// --------------------

async function isLicenseValid(licenseKey) {
  try {
    console.log("Checking license validity for:", licenseKey);

    const license = await licenseModel.findOne({ licenseKey });
    console.log("License found:", license);

    if (!license) {
      console.log("License validation failed: Not found for license:", licenseKey);
      return false;
    }

    // Expired check
    if (license.endDate < new Date() || license.status === "expired") {
      console.log("License validation failed: Expired license:", licenseKey);
      return false;
    }

    // Active check
    if (license.status === "active") {
      console.log("License validation success:", licenseKey);
      return true;
    }

    // Catch-all fallback for other statuses
    console.log("License validation failed: License status is not active:", {
      licenseKey,
      status: license.status,
    });

    return false;
  } catch (error) {
    console.error("Error in isLicenseValid database query:", error);
    return false;
  }
}

async function checkAlgo(licenseKey) {
  try {
    console.log("Checking algo mode for license:", licenseKey);

    const result = await licenseModel.findOne({ licenseKey });

    if (!result || result.mode === "OFF") {
      console.log("Algo mode check failed. Algo is OFF or license not found:", {
        licenseKey,
        mode: result?.mode,
      });

      return false;
    }

    console.log("Algo mode is ON for license:", licenseKey);
    return true;
  } catch (error) {
    console.error("Error in checkAlgo database query:", error);
    return false;
  }
}

// --------------------
// HTTP Express Server Setup
// --------------------

appx.post("/tv", async (req, res) => {
  console.log("====================================");
  console.log("NEW ORDER SIGNAL RECEIVED ON /tv");
  console.log("Raw webhook body:", req.body);
  console.log("====================================");

  const { license, symbol, side, lot, sl, tp } = req.body;

  console.log("Parsed order signal:", {
    license,
    symbol,
    side,
    lot,
    sl,
    tp,
  });

  if (!license || !symbol || !side || !lot) {
    console.log("ORDER NOT SENT TO MT5");
    console.log("Reason: Missing required fields");
    console.log("Received body:", req.body);

    return res.status(400).json({
      error: "Missing required fields",
      receivedBody: req.body,
    });
  }

  try {
    console.log("Step 1: Validating license before sending order to MT5:", license);

    const valid = await isLicenseValid(license);

    if (!valid) {
      console.log("ORDER NOT SENT TO MT5");
      console.log("Reason: License is expired or invalid");
      console.log("License:", license);

      return res.status(400).json({
        error: "Expired or invalid license",
      });
    }

    console.log("Step 2: Checking algo mode for license:", license);

    const passSignal = await checkAlgo(license);

    if (!passSignal) {
      console.log("ORDER NOT SENT TO MT5");
      console.log("Reason: Algo mode is OFF");
      console.log("License:", license);

      return res.status(400).json({
        error: "Algo Mode is OFF",
      });
    }

    console.log("Step 3: Checking active MT5 TCP connection for license:", license);
    console.log("Currently active MT5 licenses:", Array.from(activeLicenses.keys()));

    const socket = activeLicenses.get(license);

    if (!socket || socket.destroyed || !socket.writable) {
      console.log("ORDER NOT SENT TO MT5");
      console.log("Reason: MT5 socket not connected or socket is dead");
      console.log("License:", license);
      console.log("Socket exists:", !!socket);
      console.log("Socket destroyed:", socket?.destroyed);
      console.log("Socket writable:", socket?.writable);

      activeLicenses.delete(license);

      return res.status(400).json({
        error: "MT5 not connected",
      });
    }

    console.log("Step 4: MT5 socket found and writable for license:", license);

    const message =
      JSON.stringify({
        type: "ORDER",
        payload: {
          license,
          symbol,
          side,
          lot: Number(lot),
          sl: Number(sl || 0),
          tp: Number(tp || 0),
        },
      }) + "\n";

    console.log("Step 5: Sending this order message to MT5:", message);

    socket.write(message, (err) => {
      if (err) {
        console.log("FAILED_TO_SEND_MT5");
        console.log("ORDER NOT SENT TO MT5");
        console.log("Reason: socket.write failed");
        console.log("Error:", err.message);
        console.log("License:", license);

        activeLicenses.delete(license);

        return res.status(500).json({
          error: "Failed to send data to MT5",
        });
      }

      console.log("DATA_SENT_TO_MT5_SUCCESSFULLY");
      console.log("Order successfully sent to MT5 for license:", license);
      console.log("Symbol:", symbol);
      console.log("Side:", side);
      console.log("Lot:", lot);

      return res.json({
        status: "SENT_TO_MT5",
      });
    });
  } catch (error) {
    console.error("TV_ROUTE_ERROR:", error);

    console.log("ORDER NOT SENT TO MT5");
    console.log("Reason: Server error inside /tv route");
    console.log("License:", license);

    return res.status(500).json({
      error: "Server error",
    });
  }
});

// Keep your same function name
function httpservercall() {
  const httpServer = http.createServer(appx);

  httpServer.listen(HTTP_PORT, "0.0.0.0", () => {
    console.log(`HTTP server running on port ${HTTP_PORT}`);
  });
}

httpservercall();

// --------------------
// TCP Server Setup
// --------------------

async function handleTCPMessage(socket, message, state) {
  // Browser/Render health check HTTP request safety filter
  if (/^(GET|POST|HEAD|OPTIONS)/.test(message)) {
    console.log("HTTP request discovered on TCP port. Closing socket connection...");
    socket.end();
    return;
  }

  let data;

  try {
    data = JSON.parse(message);
  } catch (err) {
    console.log("Invalid JSON payload intercepted:", message);

    socket.write(
      JSON.stringify({
        status: "ERROR",
        message: "Invalid JSON Structure",
      }) + "\n"
    );

    socket.end();
    return;
  }

  console.log("TCP message received: check point ", data);

  if (data.type === "PING") {
    console.log("PING RECEIVED FROM MT5");
    console.log("PING license:", state.authenticatedLicense || "NOT_AUTHENTICATED_YET");
    console.log("PING socket IP:", socket.remoteAddress);
    console.log("Active licenses during PING:", Array.from(activeLicenses.keys()));

    socket.write(
      JSON.stringify({
        status: "PONG",
      }) + "\n"
    );

    return;
  }

  if (data.type === "AUTH") {
    const license = data.license;

    console.log("AUTH REQUEST RECEIVED FROM MT5");
    console.log("AUTH license:", license);
    console.log("AUTH socket IP:", socket.remoteAddress);

    const valid = await isLicenseValid(license);

    console.log("License validation result for", license, ":", valid);

    if (!valid) {
      console.log("AUTH DENIED");
      console.log("Reason: Invalid or expired license");
      console.log("License:", license);

      socket.write(
        JSON.stringify({
          status: "DENIED",
        }) + "\n"
      );

      socket.end();
      return;
    }

    // FIX: Overwrite the stale old connection if it exists
    if (activeLicenses.has(license)) {
      console.log(`Stale session detected for license: ${license}. Evicting old socket.`);

      const oldSocket = activeLicenses.get(license);

      try {
        oldSocket.write(
          JSON.stringify({
            status: "DENIED",
            message: "New session established elsewhere",
          }) + "\n"
        );

        oldSocket.destroy();
      } catch (e) {
        console.log("Error destroying old socket:", e.message);
      }

      activeLicenses.delete(license);
    }

    state.authenticatedLicense = license;
    activeLicenses.set(license, socket);

    console.log("License added to activeLicenses map:", license);
    console.log("All active licenses after AUTH:", Array.from(activeLicenses.keys()));

    socket.write(
      JSON.stringify({
        status: "OK",
        message: "Authenticated",
      }) + "\n"
    );

    console.log("License successfully linked/connected:", license);
    return;
  }

  if (!state.authenticatedLicense) {
    console.log("TCP DATA DENIED");
    console.log("Reason: Message received before AUTH");
    console.log("Message:", data);

    socket.write(
      JSON.stringify({
        status: "DENIED",
        message: "Authentication required",
      }) + "\n"
    );

    socket.end();
    return;
  }

  console.log("Data processing from license stream:", state.authenticatedLicense, data);

  if (data.type === "ORDER_RESULT") {
    console.log("ORDER RESULT RECEIVED FROM MT5");
    console.log("License:", state.authenticatedLicense);
    console.log("Order result:", data);
  }
}

const server = net.createServer((socket) => {
  console.log("New TCP connection pipeline registered:", socket.remoteAddress);

  const connectionState = {
    authenticatedLicense: null,
  };

  let bufferData = "";

  socket.on("data", async (buffer) => {
    bufferData += buffer.toString("utf8");

    let boundary = bufferData.indexOf("\n");

    while (boundary !== -1) {
      const singleMessage = bufferData.substring(0, boundary).trim();
      bufferData = bufferData.substring(boundary + 1);

      if (singleMessage.length > 0) {
        await handleTCPMessage(socket, singleMessage, connectionState);
      }

      boundary = bufferData.indexOf("\n");
    }
  });

  socket.on("close", () => {
    if (connectionState.authenticatedLicense) {
      activeLicenses.delete(connectionState.authenticatedLicense);

      console.log(
        "License dropped/disconnected from pool:",
        connectionState.authenticatedLicense
      );

      console.log("All active licenses after disconnect:", Array.from(activeLicenses.keys()));
    } else {
      console.log("Unauthenticated TCP socket closed:", socket.remoteAddress);
    }
  });

  socket.on("error", (err) => {
    console.log("Active TCP socket interface runtime error:", err.message);

    if (connectionState.authenticatedLicense) {
      console.log("Socket error happened for license:", connectionState.authenticatedLicense);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TCP server successfully active on port ${PORT}`);
});