const express = require("express");

const router =
  express.Router();

const {
  getLatestConversation
} = require(
  "../controllers/conversationController"
);

router.get(
  "/latest",
  getLatestConversation
);

module.exports = router;