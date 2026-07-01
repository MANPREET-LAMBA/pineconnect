const appx = require("./websitehttp/server")
const http = require("http")
const cors = require('cors')
const licenseModel = require("./websitehttp/schema/licenseSchema")
const express = require('express');
appx.use(express.json());
appx.use(express.urlencoded({ extended: true }));


appx.post("/tv", async (req, res) => {
  const { license, symbol, side, lot, sl, tp } = req.body;


 
    try{
    const valid = await isLicenseValid(license);
  
   

    const passSignal = await checkAlgo(license)
 

    if (valid == false ) {
      return res.status(400).json({ error: "expired licence" });
    }

    if(!passSignal){
      return res.status(400).json({ error: "Algo Mode is OFF" });
    }
  } catch (error) {

    res.status(400).json.toString({
      message: "server error in isLicenseValid "
    })
  }

  // console.log(symbol)

  // 1. Check if MT5 is connected
  const socket = activeLicenses.get(license);
  if (!socket) {
    return res.status(400).json({ error: "MT5 not connected" });
  }

  // 2. Forward signal to MT5 via TCP
  socket.write(JSON.stringify({
    type: "ORDER",
    payload: { license, symbol, side, lot, sl, tp }
  }) + "\n");

  console.log(JSON.stringify({
    type: "ORDER",
    payload: { symbol, side, lot, sl, tp }
  }))

  res.json({ status: "SENT_TO_MT5" });
});


const httpservercall = () => {


  const server = http.createServer(appx);

  server.listen(3000, () => {
    console.log("server live http 3000");



  })
}

httpservercall();
//tcp
const net = require("net");

const PORT = 9001;
const activeLicenses = new Map();

async function isLicenseValid(licenseKey) {
  const license = await licenseModel.findOne({ licenseKey });
  console.log("License found:", license);

  if (!license) {
    console.log("false in 1 if");
    return false;
  }

  // Expired check
  if (license.endDate < new Date() || license.status == "expired") {

    console.log("false");
    

    return false;
  }

  // Inactive check
  if (license.status == "active") {
    return true;
  }

  
}

async function checkAlgo(licenseKey){
  try {

    const result = await licenseModel.findOne({licenseKey})
   
   

    if(result.mode == "OFF"){
      return false
    }

    return true
    
    
  } catch (error) {
    
  }
}
const server = net.createServer((socket) => {
  console.log("New TCP connection:", socket.remoteAddress);

  let authenticatedLicense = null;

  socket.on("data", async (buffer) => {
    const message = buffer.toString("utf8").trim();
    console.log("Received:", message);

    // Browser/Render health check HTTP request ignore
    if (
      message.startsWith("GET") ||
      message.startsWith("POST") ||
      message.startsWith("HEAD") ||
      message.startsWith("OPTIONS")
    ) {
      console.log("HTTP request on TCP port. Closing...");
      socket.end();
      return;
    }

    let data;

    try {
      data = JSON.parse(message);
    } catch (err) {
      console.log("Invalid JSON:", message);
      socket.write(JSON.stringify({ status: "ERROR", message: "Invalid JSON" }));
      socket.end();
      return;
    }

    if (data.type === "AUTH") {
      const license = data.license;

      const valid = await isLicenseValid(license);
      console.log("License validation result for", license, ":", valid);

      if (!valid) {
        socket.write(JSON.stringify({ status: "DENIED" }));
        socket.end();
        return;
      }

      if (activeLicenses.has(license)) {
        socket.write(JSON.stringify({ status: "ALREADY_CONNECTED" }));
        socket.end();
        return;
      }

      authenticatedLicense = license;
      activeLicenses.set(license, socket);

      socket.write(JSON.stringify({ status: "OK", message: "Authenticated" }));
      console.log("License connected:", license);
      return;
    }

    if (!authenticatedLicense) {
      socket.write(JSON.stringify({ status: "DENIED", message: "Auth required" }));
      socket.end();
      return;
    }

    console.log("Data from license:", authenticatedLicense, data);
  });

  socket.on("close", () => {
    if (authenticatedLicense) {
      activeLicenses.delete(authenticatedLicense);
      console.log("License disconnected:", authenticatedLicense);
    }
  });

  socket.on("error", (err) => {
    console.log("Socket error:", err.message);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`TCP server running on port ${PORT}`);
});
// --------------------
// Dummy License Check
// --------------------




// app.get("/", (req, res) => {
//   res.send("HTTP SERVER OK");
// });
// app.listen(3000, () => {
//   console.log("🌐 HTTP server listening on 3000");
// });


