const express = require("express");
const portal = express.Router();

const licenses = require("../schema/licenseSchema")
// PATCH /api/licenses/:licenseKey/owner
// Body: { username: string }
portal.patch("/:licenseKey/owner", async (req, res) => {
  const { licenseKey } = req.params;
  const { username } = req.body;

  if (!username || typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    // Replace this with your DB call, e.g.:
    // await db.licenses.update({ where: { key: licenseKey }, data: { owner: username.trim() } });
    
    const result = await licenses.findOneAndUpdate({licenseKey: licenseKey },{ $set : {
            licenseName : username
    }})



    return res.json({ success: true, licenseKey, username: username.trim() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update owner" });
  }
});

// PATCH /api/licenses/:licenseKey/mode
// Body: { mode: "Algo" | "Manual" }
portal.patch("/:licenseKey/mode", async (req, res) => {
  const { licenseKey } = req.params;
  const { mode } = req.body;
console.log("in mode");

  if (!["ON", "OFF"].includes(mode)) {
    return res.status(400).json({ error: "mode must be 'Algo' or 'Manual'" });
  }

  try {
    // Replace this with your DB call, e.g.:
    // await db.licenses.update({ where: { key: licenseKey }, data: { mode } });

     const result = await licenses.findOneAndUpdate({licenseKey: licenseKey },{ $set : {
            mode : mode
    }})
    console.log(`[License] Updated mode of ${licenseKey} → ${mode}`);

    return res.json({ success: true, licenseKey, mode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update mode" });
  }
});

module.exports = portal;

// --- Mount in your app.js / server.js like this ---
// const licenseRoutes = require("./licenseRoutes");
// app.use("/api/licenses", licenseRoutes);