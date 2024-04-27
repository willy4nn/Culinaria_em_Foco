const express = require("express");
const router = express.Router();
const { likesController } = require("../controllers/likesControllers.js");
const permissionVerify = require("../middlewares/permissionVerify.js");

router.get("/posts/isliked", permissionVerify, likesController.getPostsIsLiked);
router.get("/posts", likesController.getPostLikes);
router.get("/posts/:id", likesController.getPostLike);
router.post("/posts", permissionVerify, likesController.likeUnlikePost);

router.get("/comments/isliked", permissionVerify, likesController.getCommentsIsLiked);
router.get("/comments", likesController.getCommentlikes);
router.get("/comments/:id", likesController.getCommentLike);
router.post("/comments", permissionVerify, likesController.likeUnlikeComment);

router.get("/replies/isliked", permissionVerify, likesController.getRepliesIsLiked);
router.get("/replies", likesController.getRepliesLikes);
router.get("/replies/:id", likesController.getReplyLike);
router.post("/replies", permissionVerify, likesController.likeUnlikeReply);

module.exports = router;
