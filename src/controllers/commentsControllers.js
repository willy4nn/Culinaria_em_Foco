const commentsRepository = require("../repositories/commentsRepository.js");

const commentsController = {

    // CREATE
    createComment: async (req, res) => {
        const { posts_id, content } = req.body;
        const users_id = req.user.id;

        console.log(posts_id, users_id, content);

        try {
            const response = await commentsRepository.createComment(
                posts_id,
                users_id,
                content,
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    

    // GET ALL COMMENTS BY POST ID AND JOIN WITH USERS NAME
    getCommentsByPostId: async (req, res) => {
        const posts_id = req.query.posts_id;

        try {
            const response = await commentsRepository.getCommentsByPostId(posts_id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    // GET ALL
    getComments: async (req, res) => {
        try {
            const response = await commentsRepository.getComments();

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getComment: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await commentsRepository.getComment(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // UPDATE
    updateComment: async (req, res) => {
        const id = req.params.id;
        const { content } = req.body;

        try {
            const response = await commentsRepository.updateComment(id, content);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // DELETE
    deleteComment: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await commentsRepository.deleteComment(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { commentsController };
