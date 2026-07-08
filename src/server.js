const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const { WebSocketServer } = require("ws");

const connectDB = require("./config/db");

const recordingRoutes = require("./routes/recordingRoutes");
const wifiRoutes = require("./routes/wifiRoutes");
const transcriptRoutes = require("./routes/transcriptRoutes");
const audioRoutes = require("./routes/audioRoutes");
const settingsRoutes = require("./routes/settingsRoutes");


const { handleEsp32Connection } = require("./sockets/esp32Socket");
const { handleFrontendConnection } = require("./sockets/frontendSocket");
const device = require("./controllers/deviceController");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "*",
}));
app.use(express.json());

app.get("/api/status", (req, res) => res.json(device.getStatus()));
app.use("/api/recording", recordingRoutes);
app.use("/api/wifi", wifiRoutes);
app.use("/api/transcripts", transcriptRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/settings", settingsRoutes);


const server = http.createServer(app);

// Two separate WebSocket servers, routed by URL path during the HTTP upgrade.
const esp32Wss = new WebSocketServer({ noServer: true });
const frontendWss = new WebSocketServer({ noServer: true });

esp32Wss.on("connection", handleEsp32Connection);
frontendWss.on("connection", handleFrontendConnection);

server.on("upgrade", (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname === "/ws/esp32") {
    esp32Wss.handleUpgrade(request, socket, head, (ws) => {
      esp32Wss.emit("connection", ws, request);
    });
  } else if (pathname === "/ws/frontend") {
    frontendWss.handleUpgrade(request, socket, head, (ws) => {
      frontendWss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

async function start() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

start();