const express = require("express");
const router = express.Router();
const { commentsController } = require("../controllers/commentsControllers.js");
const permissionVerify = require("../middlewares/permissionVerify.js");

router.get('/search', permissionVerify, commentsController.getCommentsByPostId);
router.get("/all", commentsController.getComments);
router.get("/:id", commentsController.getComment);
router.post("/", permissionVerify, commentsController.createComment);
router.put("/:id", commentsController.updateComment);
router.delete("/:id", commentsController.deleteComment);

module.exports = router;
