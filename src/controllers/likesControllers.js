const likesRepository = require("../repositories/likesRepository.js");

const likesController = {

    /** POSTS **/

    // CREATE / DELETE
    likeUnlikePost: async (req, res) => {
        const posts_id = req.body.posts_id;
        const users_id = req.user.id

        try {
            const response = await likesRepository.likeUnlikePost(
                posts_id,
                users_id
            );

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

    // GET BY POST ID AND USER ID
    getPostsIsLiked: async (req, res) => {
        const posts_id = req.query.posts_id;
        const users_id = req.user.id;
        console.log("po", posts_id);
        console.log("us", users_id);

        try {
            const response = await likesRepository.getPostsIsLiked(posts_id, users_id);

            console.log("resp", response);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },


    /** COMMENTS  **/

    // CREATE / DELETE
    likeUnlikeComment: async (req, res) => {
        const posts_comments_id = req.body.posts_comments_id;
        const users_id = req.user.id;

        try {
            const response = await likesRepository.likeUnlikeComment(posts_comments_id, users_id);

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

    // GET BY COMMENT ID AND USER ID
    getCommentsIsLiked: async (req, res) => {
        const comments_id = req.query.comments_id;
        const users_id = req.user.id;

        try {
            const response = await likesRepository.getCommentsIsLiked(comments_id, users_id);

            console.log("resp", response);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    /** REPLIES  **/

    // CREATE / DELETE
    likeUnlikeReply: async (req, res) => {
        const comments_replies_id = req.body.comments_replies_id;
        const users_id = req.user.id

        try {
            const response = await likesRepository.likeUnlikeReply(comments_replies_id, users_id);

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

    // GET BY REPLY ID AND USER ID
    getRepliesIsLiked: async (req, res) => {
        const replies_id = req.query.replies_id;
        const users_id = req.user.id;

        try {
            const response = await likesRepository.getRepliesIsLiked(replies_id, users_id);

            console.log("resp", response);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { likesController };
