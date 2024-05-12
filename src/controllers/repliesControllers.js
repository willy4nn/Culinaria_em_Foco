const repliesRepository = require("../repositories/repliesRepository.js");

const repliesController = {

    // CREATE
    createReply: async (req, res) => {
        const { posts_comments_id, content } = req.body;
        const users_id = req.user.id;

        try {
            const response = await repliesRepository.createReply(posts_comments_id, users_id, content);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL replies BY comment ID and JOIN with users name and profile_photo
    getRepliesByCommentId: async (req, res) => {
        const comments_id = req.query.comments_id;
        const users_id = req.user.id;

        try {
            const response = await repliesRepository.getRepliesByCommentId(comments_id, users_id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getReply: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await repliesRepository.getReply(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL
    getReplies: async (req, res) => {
        try {
            const response = await repliesRepository.getReplies();

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // UPDATE
    updateReply: async (req, res) => {
        const id = req.params.id;
        const { content } = req.body;

        try {
            const response = await repliesRepository.updateReply(id, content);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // DELETE
    deleteReply: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await repliesRepository.deleteReply(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { repliesController };
