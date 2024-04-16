const express = require("express");
const router = express.Router();

const loginRoutes = require("./loginRoutes");
const postsRoutes = require("./postsRoutes");
const likesRoutes = require("./likesRoutes");
const commentsRoutes = require("./commentsRoutes");
const repliesRoutes = require("./repliesRoutes");
const userRoutes = require("./userRoutes");

router.use("/login", loginRoutes);
router.use("/posts", postsRoutes);
router.use("/likes", likesRoutes);
router.use("/comments", commentsRoutes);
router.use("/replies", repliesRoutes);
// router.use('/user', userRoutes);

module.exports = router;
