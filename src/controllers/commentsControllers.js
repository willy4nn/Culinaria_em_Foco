const commentsRepository = require("../repositories/commentsRepository.js");

const commentsController = {

    // CREATE
    createComment: async (req, res) => {
        const { posts_id, users_id, content } = req.body;

        try {
            const response = await commentsRepository.insertData(
                posts_id,
                users_id,
                content,
            );

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

    // GET ALL
    getComments: async (req, res) => {
        try {
            const response = await commentsRepository.getComments();

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
