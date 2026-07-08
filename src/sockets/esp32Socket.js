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
    console.log("Rejected a new ESP32 connection: one is already connected");
    ws.close(1008, "Another device already connected");
    return;
  }

  device.setEsp32Socket(ws);
  console.log("ESP32 connected");
  device.broadcastToFrontend(device.getStatus());

  let chunkCount = 0;

  ws.on("message", (message, isBinary) => {
    if (isBinary) {
      chunkCount++;
      console.log(`Received audio chunk #${chunkCount}, size: ${message.length} bytes, recording=${device.isRecording()}`);
      device.appendAudioChunk(message);
    } else {
      console.log("ESP32 says:", message.toString());
    }
  });

  ws.on("close", (code, reason) => {
    device.clearEsp32Socket();
    console.log("ESP32 disconnected. Code:", code, "Reason:", reason.toString());
    device.broadcastToFrontend(device.getStatus());
  });

  ws.on("error", (err) => {
    console.log("ESP32 socket error:", err.message);
  });
}

module.exports = { handleEsp32Connection };