const favoritePostsRepository = require("../repositories/favoritePostsRepository.js");

const favoritePostsController = {

    // CREATE
    createFavoritePost: async (req, res) => {
        const { users_id, posts_id } = req.body;
  
        try {
            const response = await favoritePostsRepository.createFavoritePost(
                users_id,
                posts_id 
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getFavoritePost: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await favoritePostsRepository.getFavoritePost(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL
    getFavoritePosts: async (req, res) => {
        try {
            const response = await favoritePostsRepository.getFavoritePosts();

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // NO UPDATE
    
    // DELETE
    deleteFavoritePost: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await favoritePostsRepository.deleteFavoritePost(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { favoritePostsController };
