const postsRepository = require("../repositories/postsRepository.js");

const postsController = {

    // CREATE
    createPost: async (req, res) => {
        const { title, category, content, banner, image, posted_draft } = req.body;
        const created_by = 1; //req.user.id
        const updated_by = 1; //req.user.id
        const status = 'active';

        try {
            const response = await postsRepository.createPost(
                title,
                category,
                content,
                banner,
                image,
                posted_draft,
                status,
                created_by,
                updated_by,
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET BY ID
    getPost: async (req, res) => {
        const id = req.params.id;

        try {
            const response = await postsRepository.getPost(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // GET ALL
    getPosts: async (req, res) => {
        try {
            const response = await postsRepository.getPosts();

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // UPDATE
    updatePost: async (req, res) => {
        const id = req.params.id;
        const { title, category, content, banner, image, posted_draft, status, updated_by } = req.body;

        try {
            const response = await postsRepository.updatePost(
                id, title, category, content, banner, image, posted_draft, status, updated_by
            );

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },

    // DELETE
    deletePost: async (req, res) => {
        const id = req.params.id;
        console.log("id",id);

        try {
            const response = await postsRepository.deletePost(id);

            res.status(200).json({ data: response, status: 200 });
        } catch (error) {
            res.status(error.code || 500).json({ error, status: error.code || 500 });
        }
    },
};

module.exports = { postsController };
