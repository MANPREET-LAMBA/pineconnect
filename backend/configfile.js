const appx = require("./websitehttp/server");
const http = require("http");
const cors = require('cors');
const licenseModel = require("./websitehttp/schema/licenseSchema");
const express = require('express');
const net = require("net");

appx.use(express.json());
appx.use(express.urlencoded({ extended: true }));

const PORT = 9001;
const activeLicenses = new Map();

// --------------------
// Helper Functions
// --------------------

async function isLicenseValid(licenseKey) {
  try {
    const license = await licenseModel.findOne({ licenseKey });
    console.log("License found:", license);

    if (!license) {
      console.log("License validation failed: Not found");
      return false;
    }

    // Expired check
    if (license.endDate < new Date() || license.status === "expired") {
      console.log("License validation failed: Expired");
      return false;
    }

    // Inactive check
    if (license.status === "active") {
      return true;
    }

    // Catch-all fallback for other statuses (e.g., suspended, pending)
    return false;
  } catch (error) {
    console.error("Error in isLicenseValid database query:", error);
    return false;
  }
}

async function checkAlgo(licenseKey) {
  try {
    const result = await licenseModel.findOne({ licenseKey });
    if (!result || result.mode === "OFF") {
      return false;
    }
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
  const { license, symbol, side, lot, sl, tp } = req.body;

  try {
    const valid = await isLicenseValid(license);
    const passSignal = await checkAlgo(license);

    if (!valid) {
      return res.status(400).json({ error: "expired or invalid licence" });
    }

    if (!passSignal) {
      return res.status(400).json({ error: "Algo Mode is OFF" });
    }
  } catch (error) {
    console.error("HTTP Route Error:", error);
    return res.status(500).json({ error: "Server error in license validation" });
  }

  // 1. Check if MT5 is connected
  const socket = activeLicenses.get(license);
  if (!socket) {
    return res.status(400).json({ error: "MT5 not connected" });
  }

  // 2. Forward signal to MT5 via TCP (with newline delimiter)
  socket.write(JSON.stringify({
    type: "ORDER",
    payload: { license, symbol, side, lot, sl, tp }
  }) + "\n");

  console.log("Signal dispatched:", JSON.stringify({
    type: "ORDER",
    payload: { symbol, side, lot, sl, tp }
  }));

  return res.json({ status: "SENT_TO_MT5" });
});

const httpservercall = () => {
  const server = http.createServer(appx);
  server.listen(3000, () => {
    console.log("HTTP server live on port 3000");
  });
};

httpservercall();

// --------------------
// TCP Server Setup
// --------------------

// Business logic isolated to handle atomic TCP string extractions safely
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
    socket.write(JSON.stringify({ status: "ERROR", message: "Invalid JSON Structure" }) + "\n");
    socket.end();
    return;
  }

  if (data.type === "AUTH") {
    const license = data.license;
    const valid = await isLicenseValid(license);
    console.log("License validation result for", license, ":", valid);

    if (!valid) {
      socket.write(JSON.stringify({ status: "DENIED" }) + "\n");
      socket.end();
      return;
    }

    if (activeLicenses.has(license)) {
      socket.write(JSON.stringify({ status: "ALREADY_CONNECTED" }) + "\n");
      socket.end();
      return;
    }

    state.authenticatedLicense = license;
    activeLicenses.set(license, socket);

    socket.write(JSON.stringify({ status: "OK", message: "Authenticated" }) + "\n");
    console.log("License successfully linked/connected:", license);
    return;
  }

  if (!state.authenticatedLicense) {
    socket.write(JSON.stringify({ status: "DENIED", message: "Authentication required" }) + "\n");
    socket.end();
    return;
  }

  console.log("Data processing from license stream:", state.authenticatedLicense, data);
}

const server = net.createServer((socket) => {
  console.log("New TCP connection pipeline registered:", socket.remoteAddress);

  // Connection tracking reference state
  const connectionState = {
    authenticatedLicense: null
  };

  let bufferData = "";

  socket.on("data", async (buffer) => {
    // Append chunks into a string buffer
    bufferData += buffer.toString("utf8");

    // Read streams by evaluating explicit newline boundary splits (\n)
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
      console.log("License dropped/disconnected from pool:", connectionState.authenticatedLicense);
    }
  });

  socket.on("error", (err) => {
    console.log("Active TCP socket interface runtime error:", err.message);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TCP server successfully active on port ${PORT}`);
});