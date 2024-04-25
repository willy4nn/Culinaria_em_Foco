const express = require("express");
const router = express.Router();
const { favoritePostsController } = require("../controllers/favoritePostsControllers.js");
const permissionVerify = require("../middlewares/permissionVerify.js");

//Rotas de verificação do posts do Usuário
router.get("/search", permissionVerify, favoritePostsController.getIsFavorited);
router.get("/", permissionVerify, favoritePostsController.getPostsFavorited);
router.get("/all", favoritePostsController.getFavoritePosts);
router.get("/:id", favoritePostsController.getFavoritePost);
router.post("/", permissionVerify, favoritePostsController.createFavoritePost);
router.delete("/:id", favoritePostsController.deleteFavoritePost);

module.exports = router;
