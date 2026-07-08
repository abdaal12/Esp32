/**
 * backend/controllers/deviceController.js
 *
 * Single source of truth for:
 *  - the one ESP32 WebSocket connection
 *  - the set of frontend WebSocket clients (for live status/transcript push)
 *  - current recording state + in-progress audio buffer
 *
 * Sockets and route controllers both read/write through this module
 * instead of holding their own state.
 */

let esp32Socket = null;
const frontendClients = new Set();

let recording = false;
let audioChunks = []; // array of Buffers while a recording is in progress

function setEsp32Socket(ws) {
  esp32Socket = ws;
}

function clearEsp32Socket() {
  esp32Socket = null;
  recording = false;
  audioChunks = [];
}

function isDeviceConnected() {
  return esp32Socket !== null;
}

function sendCommandToDevice(cmd) {
  if (!esp32Socket) return false;
  esp32Socket.send(JSON.stringify({ cmd }));
  return true;
}

function addFrontendClient(ws) {
  frontendClients.add(ws);
}

function removeFrontendClient(ws) {
  frontendClients.delete(ws);
}

function broadcastToFrontend(message) {
  const payload = JSON.stringify(message);
  for (const ws of frontendClients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(payload);
    }
  }
}

function getStatus() {
  return {
    type: "status",
    deviceConnected: isDeviceConnected(),
    recording,
  };
}

function startRecordingState() {
  recording = true;
  audioChunks = [];
}

function stopRecordingState() {
  recording = false;
}

function isRecording() {
  return recording;
}

function appendAudioChunk(buffer) {
  if (recording) {
    audioChunks.push(buffer);
  }
}

function drainAudioBuffer() {
  const combined = Buffer.concat(audioChunks);
  audioChunks = [];
  return combined;
}

module.exports = {
  setEsp32Socket,
  clearEsp32Socket,
  isDeviceConnected,
  sendCommandToDevice,
  addFrontendClient,
  removeFrontendClient,
  broadcastToFrontend,
  getStatus,
  startRecordingState,
  stopRecordingState,
  isRecording,
  appendAudioChunk,
  drainAudioBuffer,
};