/**
 * backend/sockets/esp32Socket.js
 *
 * Handles the ESP32's persistent WebSocket connection at /ws/esp32.
 * Binary frames = audio chunks (only kept if currently recording).
 * Text frames = optional log/status messages from the device.
 */

const device = require("../controllers/deviceController");

function handleEsp32Connection(ws) {
  if (device.isDeviceConnected()) {
    ws.close(1008, "Another device already connected");
    return;
  }

  device.setEsp32Socket(ws);
  console.log("ESP32 connected");
  device.broadcastToFrontend(device.getStatus());

  ws.on("message", (message, isBinary) => {
    if (isBinary) {
      device.appendAudioChunk(message);
    } else {
      console.log("ESP32 says:", message.toString());
    }
  });

   ws.on("error", (err) => {
    console.log("ESP32 socket error:", err.message);
  });
}

module.exports = { handleEsp32Connection };