const express = require("express");
const router = express.Router();
const { repliesController } = require("../controllers/repliesControllers.js");
const permissionVerify = require("../middlewares/permissionVerify")

router.get('/search', repliesController.getRepliesByCommentId);
router.get("/", repliesController.getReplies);
router.get("/:id", repliesController.getReply);
router.post("/", permissionVerify, repliesController.createReply);
router.put("/:id", permissionVerify, repliesController.updateReply);
router.delete("/:id", permissionVerify, repliesController.deleteReply);

module.exports = router;
