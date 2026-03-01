const appx =  require("./websitehttp/server")
const http = require("http")

const httpservercall = ()=>{

    
    const server = http.createServer(appx);

    server.listen(3000,()=>{
    console.log("server live http 3000");
    

    
})
}

httpservercall();

// tcp code ========================================


const net = require("net");
// http for tradingview signal
const express = require("express")
const app = express();
app.use(express.json());


// Store active license connections
// licenseKey => socket
const activeLicenses = new Map();

const PORT = 9001;


  const server = net.createServer((socket) => {
  console.log("📡 New TCP connection from", socket.remoteAddress);

  let authenticatedLicense = null;
  let message = " ";
  // Receive data from DLL
  socket.on("data", (buffer) => {
    try {
      console.log("start");

      message = buffer.toString("utf8").trim(" ");
      console.log(typeof (message));

      const data = JSON.parse(message);

      console.log(data);




      // ======================
      // LICENSE AUTH HANDSHAKE
      // ======================
      if (data.type === "AUTH") {
        const license = data.license;

        // 🔒 Validate license (replace with DB/API check)
        if (!isLicenseValid(license)) {
          socket.write(JSON.stringify({ status: "DENIED" }));
          socket.end();
          return;
        }



        // ❌ License already connected
        if (activeLicenses.has(license)) {
          socket.write(
            JSON.stringify({ status: "DENIED", reason: "LICENSE_IN_USE" })
          );
          socket.end();
          return;
        }

        //database check



        // ✅ License accepted
        authenticatedLicense = license;

        activeLicenses.set(license, socket);

        socket.write(JSON.stringify({ status: "OK" }));
        console.log(`✅ License connected: ${license}`);
      }

      // ======================
      // AFTER AUTH (COMMANDS)
      // ======================
      else if (data.type === "PING" && authenticatedLicense) {
        socket.write(JSON.stringify({ type: "PONG" }));
      }

      else if (data.type === "ORDER" && authenticatedLicense) {
        console.log(
          `📥 Order from ${authenticatedLicense}:`,
          data.payload
        );
      }

    } catch (err) {
      console.error("❌ Invalid data received");
      console.error(err);
    }
  });




  // Handle disconnect
  socket.on("close", () => {
    if (authenticatedLicense) {
      activeLicenses.delete(authenticatedLicense);
      console.log(`🔌 License disconnected: ${authenticatedLicense}`);
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});


server.listen(PORT, () => {
  console.log(`🚀 TCP Server running on port ${PORT}`);
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


