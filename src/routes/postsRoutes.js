const express = require("express");
const router = express.Router();
const { postsController } = require("../controllers/postsControllers.js");

//Rotas de verificação do posts do Usuário
router.get("/all", postsController.getPosts);
router.get("/:id", postsController.getPost);
router.post("/", postsController.createPost);
router.put("/:id", postsController.updatePost);
router.delete("/:id", postsController.deletePost);

module.exports = router;
