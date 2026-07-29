/**
 * backend/src/sockets/esp32Socket.js
 *
 * Handles the ESP32's persistent WebSocket connection at /ws/esp32.
 * Binary frames = audio chunks (only kept if currently recording).
 * Text frames = optional log/status messages from the device.
 *
 * Includes a ping/pong heartbeat: some hosts (Render's free tier
 * included) can silently drop idle WebSocket connections without a
 * clean close event, leaving the backend thinking a dead connection
 * is still alive. The heartbeat actively detects and terminates those
 * stale connections instead of waiting for an eventual 1006 close,
 * so a real reconnect from the device isn't wrongly rejected as
 * "already connected."
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

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (message, isBinary) => {
    if (isBinary) {
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

// Pings the connection every 20s. If it didn't respond to the
// previous ping (isAlive still false), it's dead — terminate it so
// device state clears immediately instead of waiting for a 1006.
function startHeartbeat(wss) {
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("Terminating stale ESP32 connection (missed heartbeat)");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 20000);
}

module.exports = { handleEsp32Connection, startHeartbeat };