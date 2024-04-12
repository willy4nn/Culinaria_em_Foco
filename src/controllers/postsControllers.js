const postsRepository = require("../repositories/postsRepository.js");

const postsController = {
    createPost: async (req, res) => {
        const { title, category, content, banner, image, posted_draft, status, created_by, updated_by } = req.body;

        try {
            const response = await postsRepository.insertData(
                title,
                category,
                content,
                banner,
                image,
                posted_draft,
                status,
                created_by,
                updated_by
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    getPost: async (req, res) => {
        const { id } = req.body;

        try {
            const response = await postsRepository.selectData(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const response = await postsRepository.selectData();
            console.log("res", response);
            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    updatePost: async (req, res) => {
        const { id, name, value } = req.body;

        try {
            const response = await postsRepository.updateData(
                id,
                title,
                category,
                content,
                password,
                image,
                posted_draft,
                created_by
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
    deletePost: async (req, res) => {
        const { id } = req.body;

        try {
            const response = await postsRepository.deleteData(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { postsController };
