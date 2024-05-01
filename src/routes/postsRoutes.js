const express = require("express");
const router = express.Router();
const { postsController } = require("../controllers/postsControllers.js");
const editorPermissionVerify = require("../middlewares/editorPermissionVerify")




//Rotas de verificação do posts do Usuário
router.get("/all", postsController.getPosts);
router.get("/latest", postsController.getPostsOrderByCreatedAt);
router.get('/like', postsController.getPostsOrderByLike);
router.get("/:id", postsController.getPost);
router.get("/category/:category", postsController.getPostsByCategory);
router.get("/", editorPermissionVerify, postsController.getPostsByUserId);
router.post("/", editorPermissionVerify, postsController.createPost);
router.put("/:id", editorPermissionVerify, postsController.updatePost);
router.delete("/:id", editorPermissionVerify, postsController.deletePost);

module.exports = router;
