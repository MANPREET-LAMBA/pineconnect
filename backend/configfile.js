const appx =  require("./websitehttp/server")
const http = require("http")
const cors = require('cors')

const httpservercall = ()=>{

    
    const server = http.createServer(appx);

    server.listen(3000,()=>{
    console.log("server live http 3000");
    

    
})
}

httpservercall();
//tcp
const net = require("net");

const PORT = 9001;
const activeLicenses = new Map();

function isLicenseValid(license) {
  return Boolean(license); // replace with DB check
}

const server = net.createServer((socket) => {
  console.log("New TCP connection:", socket.remoteAddress);

  let authenticatedLicense = null;

  socket.on("data", (buffer) => {
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

      if (!isLicenseValid(license)) {
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
function isLicenseValid(license) {
  // Replace with DB / API / Redis check
  return license && license.length >= 5;
}

appx.post("/tv", (req, res) => {
  const { license, symbol, side, lot, sl, tp } = req.body;
  console.log(symbol)

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

// app.get("/", (req, res) => {
//   res.send("HTTP SERVER OK");
// });
// app.listen(3000, () => {
//   console.log("🌐 HTTP server listening on 3000");
// });


