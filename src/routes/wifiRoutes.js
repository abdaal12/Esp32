const express = require("express");
const router = express.Router();
const device = require("../controllers/deviceController");

router.post("/reset", (req, res) => {
  if (!device.isDeviceConnected()) {
    return res.status(409).json({ ok: false, error: "Device not connected" });
  }

  device.sendCommandToDevice("reset_wifi");
  res.json({
    ok: true,
    note: "Device will erase saved WiFi and reboot into setup mode.",
  });
});

module.exports = router;