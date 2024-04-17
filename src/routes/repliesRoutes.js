const express = require("express");
const router = express.Router();
const { repliesController } = require("../controllers/repliesControllers.js");

router.get("/", repliesController.getReplies);
router.get("/:id", repliesController.getReply);
router.post("/", repliesController.createReply);
router.put("/:id", repliesController.updateReply);
router.delete("/:id", repliesController.deleteReply);

module.exports = router;
