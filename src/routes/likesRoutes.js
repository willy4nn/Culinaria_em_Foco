const express = require("express");
const router = express.Router();
const { likesController } = require("../controllers/likesControllers.js");

router.get("/posts/isliked", likesController.getIsLiked);
router.get("/posts", likesController.getPostLikes);
router.get("/posts/:id", likesController.getPostLike);
router.post("/posts", likesController.likePost);
router.put("/posts/:id", likesController.unlikePost); //delete

router.get("/comments", likesController.getCommentlikes);
router.get("/comments/:id", likesController.getCommentLike);
router.post("/comments", likesController.likeComment);
router.put("/comments/:id", likesController.unlikeComment); //delete

router.get("/replies", likesController.getRepliesLikes);
router.get("/replies/:id", likesController.getReplyLike);
router.post("/replies", likesController.likeReply);
router.put("/replies/:id", likesController.unlikeReply); //delete

module.exports = router;
