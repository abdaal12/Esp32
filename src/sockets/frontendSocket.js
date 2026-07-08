/**
 * backend/sockets/frontendSocket.js
 *
 * Handles React frontend WebSocket connections at /ws/frontend.
 * Used to push live status + finished transcripts without polling.
 */

const device = require("../controllers/deviceController");

function handleFrontendConnection(ws) {
  device.addFrontendClient(ws);
  ws.send(JSON.stringify(device.getStatus()));

  ws.on("close", () => {
    device.removeFrontendClient(ws);
  });
}

module.exports = { handleFrontendConnection };