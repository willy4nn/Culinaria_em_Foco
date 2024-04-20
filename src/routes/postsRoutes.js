const express = require("express");
const router = express.Router();
const { postsController } = require("../controllers/postsControllers.js");
const editorPermissionVerify = require("../middlewares/editorPermissionVerify")


//Rotas de verificação do posts do Usuário
router.get("/all", postsController.getPosts);
router.get("/:id", postsController.getPost);
router.post("/", editorPermissionVerify, postsController.createPost);
router.put("/:id", editorPermissionVerify, postsController.updatePost);
router.delete("/:id", editorPermissionVerify, postsController.deletePost);

module.exports = router;
