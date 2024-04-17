const likesRepository = require("../repositories/likesRepository.js");

const likesController = {

    /** POSTS **/

    // CREATE
    likePost: async (req, res) => {
        const { posts_id, users_id } = req.body;

        try {
            const response = await likesRepository.likePost(
                posts_id,
                users_id
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // DELETE
    unlikePost: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await likesRepository.unlikePost(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getPostLike: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await likesRepository.getPostLike(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL
    getPostLikes: async (req, res) => {
        try {
            const response = await likesRepository.getPostLikes();
            console.log("res", response);
            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },


    /** COMMENTS  **/

    // CREATE
    likeComment: async (req, res) => {
        const { posts_comments_id, users_id } = req.body;

        try {
            const response = await likesRepository.likeComment(
                posts_comments_id,
                users_id
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    
    // DELETE
    unlikeComment: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await likesRepository.unlikeComment(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getCommentLike: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await likesRepository.getCommentLike(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL
    getCommentlikes: async (req, res) => {
        try {
            const response = await likesRepository.getCommentlikes();
            console.log("res", response);
            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    /** REPLIES  **/

    // CREATE
    likeReply: async (req, res) => {
        const { comments_replies_id, users_id } = req.body;

        try {
            const response = await likesRepository.likeReply(
                comments_replies_id,
                users_id
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    
    // DELETE
    unlikeReply: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await likesRepository.unlikeReply(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getReplyLike: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await likesRepository.getReplyLike(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL
    getRepliesLikes: async (req, res) => {
        try {
            const response = await likesRepository.getRepliesLikes();
            console.log("res", response);
            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { likesController };
