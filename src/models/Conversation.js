const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    transcript: {
      type: String,
      default: "",
    },

    response: {
      type: String,
      default: "",
    },

    deviceId: {
      type: String,
      default: "TOY001",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);