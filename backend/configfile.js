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
      console.log(
        "License validation failed: Not found for license:",
        licenseKey
      );
      return false;
    }

    if (license.endDate < new Date() || license.status === "expired") {
      console.log(
        "License validation failed: Expired license:",
        licenseKey
      );
      return false;
    }

    if (license.status === "active") {
      console.log("License validation success:", licenseKey);
      return true;
    }

    console.log(
      "License validation failed: License status is not active:",
      {
        licenseKey,
        status: license.status,
      }
    );

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
      console.log(
        "Algo mode check failed. Algo is OFF or license not found:",
        {
          licenseKey,
          mode: result?.mode,
        }
      );

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
    console.log(
      "Step 1: Validating license before sending order to MT5:",
      license
    );

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

    console.log(
      "Step 3: Checking active MT5 TCP connection for license:",
      license
    );

    console.log(
      "Currently active MT5 licenses:",
      Array.from(activeLicenses.keys())
    );

    const socket = activeLicenses.get(license);

    if (!socket || socket.destroyed || !socket.writable) {
      console.log("ORDER NOT SENT TO MT5");
      console.log("Reason: MT5 socket not connected or socket is dead");
      console.log("License:", license);
      console.log("Socket exists:", !!socket);
      console.log("Socket destroyed:", socket?.destroyed);
      console.log("Socket writable:", socket?.writable);

      if (activeLicenses.get(license) === socket) {
        activeLicenses.delete(license);
      }

      return res.status(400).json({
        error: "MT5 not connected",
      });
    }

    console.log(
      "Step 4: MT5 socket found and writable for license:",
      license
    );

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

        if (activeLicenses.get(license) === socket) {
          activeLicenses.delete(license);
        }

        if (!res.headersSent) {
          return res.status(500).json({
            error: "Failed to send data to MT5",
          });
        }

        return;
      }

      console.log("DATA_SENT_TO_MT5_SUCCESSFULLY");
      console.log(
        "Order successfully sent to MT5 for license:",
        license
      );
      console.log("Symbol:", symbol);
      console.log("Side:", side);
      console.log("Lot:", lot);

      if (!res.headersSent) {
        return res.json({
          status: "SENT_TO_MT5",
        });
      }
    });
  } catch (error) {
    console.error("TV_ROUTE_ERROR:", error);

    console.log("ORDER NOT SENT TO MT5");
    console.log("Reason: Server error inside /tv route");
    console.log("License:", license);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Server error",
      });
    }
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
  if (/^(GET|POST|HEAD|OPTIONS)/.test(message)) {
    console.log(
      "HTTP request discovered on TCP port. Closing socket connection..."
    );

    socket.end();
    return;
  }

  let data;

  try {
    data = JSON.parse(message);
  } catch (err) {
    console.log("Invalid JSON payload intercepted:", message);

    if (!socket.destroyed && socket.writable) {
      socket.write(
        JSON.stringify({
          status: "ERROR",
          message: "Invalid JSON Structure",
        }) + "\n"
      );
    }

    socket.end();
    return;
  }

  console.log("TCP message received: check point ", data);

  // --------------------
  // AUTH Handler
  // --------------------

  if (data.type === "AUTH") {
    const license =
      typeof data.license === "string"
        ? data.license.trim()
        : "";

    console.log("AUTH REQUEST RECEIVED FROM MT5");
    console.log("AUTH license:", license);
    console.log("AUTH socket IP:", socket.remoteAddress);

    if (!license) {
      console.log("AUTH DENIED");
      console.log("Reason: License key is missing");

      socket.write(
        JSON.stringify({
          status: "DENIED",
          message: "License key is required",
        }) + "\n"
      );

      socket.end();
      return;
    }

    const valid = await isLicenseValid(license);

    console.log(
      "License validation result for",
      license,
      ":",
      valid
    );

    if (!valid) {
      console.log("AUTH DENIED");
      console.log("Reason: Invalid or expired license");
      console.log("License:", license);

      socket.write(
        JSON.stringify({
          status: "DENIED",
          message: "Invalid or expired license",
        }) + "\n"
      );

      socket.end();
      return;
    }

    const oldSocket = activeLicenses.get(license);

    if (oldSocket && oldSocket !== socket) {
      console.log(
        `Old session detected for license: ${license}. Replacing old socket.`
      );

      activeLicenses.delete(license);

      try {
        if (!oldSocket.destroyed && oldSocket.writable) {
          oldSocket.write(
            JSON.stringify({
              status: "DENIED",
              message: "New session established elsewhere",
            }) + "\n"
          );
        }
      } catch (error) {
        console.log(
          "Error sending message to old socket:",
          error.message
        );
      }

      try {
        oldSocket.destroy();
      } catch (error) {
        console.log(
          "Error destroying old socket:",
          error.message
        );
      }
    }

    state.authenticatedLicense = license;
    state.isAuthenticated = true;

    activeLicenses.set(license, socket);

    console.log(
      "License added to activeLicenses map:",
      license
    );

    console.log(
      "All active licenses after AUTH:",
      Array.from(activeLicenses.keys())
    );

    socket.write(
      JSON.stringify({
        status: "OK",
        message: "Authenticated",
        license,
      }) + "\n"
    );

    console.log(
      "License successfully linked/connected:",
      license
    );

    return;
  }

  // --------------------
  // PING Handler
  // --------------------

  if (data.type === "PING") {
    const license = state.authenticatedLicense;

    console.log("PING RECEIVED FROM MT5");
    console.log(
      "PING license:",
      license || "NOT_AUTHENTICATED_YET"
    );
    console.log("PING socket IP:", socket.remoteAddress);
    console.log(
      "Active licenses during PING:",
      Array.from(activeLicenses.keys())
    );

    if (!license || !state.isAuthenticated) {
      console.log("PING DENIED");
      console.log("Reason: Socket has not completed AUTH");

      if (!socket.destroyed && socket.writable) {
        socket.write(
          JSON.stringify({
            status: "DENIED",
            message: "Authentication required",
          }) + "\n"
        );
      }

      socket.destroy();
      return;
    }

    const registeredSocket = activeLicenses.get(license);

    if (registeredSocket !== socket) {
      console.log("PING DENIED");
      console.log(
        "Reason: PING received from old or stale socket"
      );
      console.log("License:", license);

      if (!socket.destroyed && socket.writable) {
        socket.write(
          JSON.stringify({
            status: "DENIED",
            message: "Stale connection",
          }) + "\n"
        );
      }

      socket.destroy();
      return;
    }

    if (!socket.destroyed && socket.writable) {
      socket.write(
        JSON.stringify({
          status: "PONG",
          license,
          timestamp: Date.now(),
        }) + "\n"
      );
    }

    return;
  }

  // --------------------
  // Reject messages before authentication
  // --------------------

  if (!state.authenticatedLicense || !state.isAuthenticated) {
    console.log("TCP DATA DENIED");
    console.log("Reason: Message received before AUTH");
    console.log("Message:", data);

    if (!socket.destroyed && socket.writable) {
      socket.write(
        JSON.stringify({
          status: "DENIED",
          message: "Authentication required",
        }) + "\n"
      );
    }

    socket.end();
    return;
  }

  const activeSocket = activeLicenses.get(
    state.authenticatedLicense
  );

  if (activeSocket !== socket) {
    console.log("TCP DATA DENIED");
    console.log("Reason: Message received from stale socket");
    console.log(
      "License:",
      state.authenticatedLicense
    );

    socket.destroy();
    return;
  }

  console.log(
    "Data processing from license stream:",
    state.authenticatedLicense,
    data
  );

  if (data.type === "ORDER_RESULT") {
    console.log("ORDER RESULT RECEIVED FROM MT5");
    console.log("License:", state.authenticatedLicense);
    console.log("Order result:", data);
    return;
  }

  console.log("Unknown TCP message type received:", data.type);
}

// --------------------
// TCP Connection Handler
// --------------------

const server = net.createServer((socket) => {
  console.log(
    "New TCP connection pipeline registered:",
    socket.remoteAddress
  );

  socket.setKeepAlive(true, 30000);
  socket.setNoDelay(true);

  const connectionState = {
    authenticatedLicense: null,
    isAuthenticated: false,
  };

  let bufferData = "";

  socket.on("data", async (buffer) => {
    bufferData += buffer.toString("utf8");

    // Prevent unlimited memory growth
    if (bufferData.length > 1024 * 1024) {
      console.log(
        "TCP buffer limit exceeded. Closing socket:",
        socket.remoteAddress
      );

      bufferData = "";
      socket.destroy();
      return;
    }

    let boundary = bufferData.indexOf("\n");

    while (boundary !== -1) {
      const singleMessage = bufferData
        .substring(0, boundary)
        .trim();

      bufferData = bufferData.substring(boundary + 1);

      if (singleMessage.length > 0) {
        try {
          await handleTCPMessage(
            socket,
            singleMessage,
            connectionState
          );
        } catch (error) {
          console.error(
            "Error while handling TCP message:",
            error
          );
        }
      }

      if (socket.destroyed) {
        break;
      }

      boundary = bufferData.indexOf("\n");
    }
  });

  socket.on("close", () => {
    const license =
      connectionState.authenticatedLicense;

    if (!license) {
      console.log(
        "Unauthenticated TCP socket closed:",
        socket.remoteAddress
      );

      return;
    }

    const registeredSocket =
      activeLicenses.get(license);

    // Important:
    // Delete only when this closing socket is the currently active socket.
    if (registeredSocket === socket) {
      activeLicenses.delete(license);

      console.log(
        "License dropped/disconnected from pool:",
        license
      );
    } else {
      console.log(
        "Old or stale socket closed. Current active socket preserved for license:",
        license
      );
    }

    console.log(
      "All active licenses after disconnect:",
      Array.from(activeLicenses.keys())
    );
  });

  socket.on("error", (err) => {
    console.log(
      "Active TCP socket interface runtime error:",
      err.message
    );

    const license =
      connectionState.authenticatedLicense;

    if (!license) {
      return;
    }

    console.log(
      "Socket error happened for license:",
      license
    );

    const registeredSocket =
      activeLicenses.get(license);

    // Remove only if the errored socket is the current active socket.
    if (registeredSocket === socket) {
      activeLicenses.delete(license);

      console.log(
        "Errored active socket removed for license:",
        license
      );
    } else {
      console.log(
        "Error occurred on an old socket. Current active socket preserved for license:",
        license
      );
    }

    console.log(
      "Active licenses after socket error:",
      Array.from(activeLicenses.keys())
    );
  });

  socket.on("timeout", () => {
    console.log(
      "TCP socket timeout:",
      socket.remoteAddress
    );

    const license =
      connectionState.authenticatedLicense;

    if (
      license &&
      activeLicenses.get(license) === socket
    ) {
      activeLicenses.delete(license);

      console.log(
        "Timed-out socket removed for license:",
        license
      );
    }

    socket.destroy();
  });
});

server.on("error", (error) => {
  console.error("TCP SERVER ERROR:", error);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `TCP server successfully active on port ${PORT}`
  );
});