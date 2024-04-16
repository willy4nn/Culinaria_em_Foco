const express = require("express");
const router = express.Router();
const { likesController } = require("../controllers/likesControllers.js");

router.get("/posts", likesController.getPostLikes);
router.get("/posts/:id", likesController.getPostLike);
router.post("/posts", likesController.likePost);
router.delete("/posts/:id", likesController.unlikePost);

router.get("/comments", likesController.getCommentlikes);
router.get("/comments/:id", likesController.getCommentLike);
router.post("/comments", likesController.likeComment);
router.delete("/comments/:id", likesController.unlikeComment);

router.get("/replies", likesController.getRepliesLikes);
router.get("/replies/:id", likesController.getReplyLike);
router.post("/replies", likesController.likeReply);
router.delete("/replies/:id", likesController.unlikeReply);

module.exports = router;
