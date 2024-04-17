const express = require("express");
const router = express.Router();
const { commentsController } = require("../controllers/commentsControllers.js");

router.get("/all", commentsController.getComments);
router.get("/:id", commentsController.getComment);
router.post("/", commentsController.createComment);
router.put("/:id", commentsController.updateComment);
router.delete("/:id", commentsController.deleteComment);

module.exports = router;
