const express = require("express");
const router = express.Router();
const { favoritePostsController } = require("../controllers/favoritePostsControllers.js");

//Rotas de verificação do posts do Usuário
router.get("/all", favoritePostsController.getFavoritePosts);
router.get("/:id", favoritePostsController.getFavoritePost);
router.post("/", favoritePostsController.createFavoritePost);
router.delete("/:id", favoritePostsController.deleteFavoritePost);

module.exports = router;
