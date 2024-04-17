const express = require("express");
const router = express.Router();

const loginRoutes = require("./loginRoutes");
const postsRoutes = require("./postsRoutes");
const userRoutes = require("./userRoutes");

router.use("/login", loginRoutes);
router.use("/posts", postsRoutes);
// router.use('/user', userRoutes);

module.exports = router;
