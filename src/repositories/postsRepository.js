const pool = require("../database/postgres.js");

//COLUMNS: id, title, category, content, banner, image, posted_draft, status, likes_quantity,
//comments_quantity, created_at, updated_at, created_by, updated_by

const postsRepository = {

    // CREATE
    createPost: async function (title, category, content, banner, image, posted_draft, status, created_by, updated_by) {

        const query = `INSERT INTO posts (title, category, content, banner, image, posted_draft, status, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

        try {
            const result = await pool.query(query, [
                title,
                category,
                content,
                banner,
                image,
                posted_draft,
                status,
                created_by,
                updated_by,
            ]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;
            
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // GET BY ID
    getPost: async function (id) {

        const query = "SELECT * FROM posts WHERE id = $1";

        try {
            const result = await pool.query(query, [id]);
            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getPosts: async function () {

        const query = "SELECT * FROM posts";

        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL BY CATEGORY
    getPostsByCategory: async function (category) {

        const query = "SELECT * FROM posts WHERE category = $1";

        try {
            const result = await pool.query(query, [category]);
            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } 
    },

    // GET ALL ORDER BY LIKES (LIMIT = MAX RESULTS)
    getPostsOrderByLike: async function (maxResults) {

        // Se limit for omitido, retorna todas as ocorrências
        const limit = maxResults === "" ? null : maxResults;
        const query = "SELECT * FROM posts ORDER BY likes_quantity DESC LIMIT $1";

        try {
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL ORDER BY CREATED_AT (LIMIT = MAX RESULTS)
    getPostsOrderByCreatedAt: async function (maxResults) {

        // Se limit for omitido, retorna todas as ocorrências
        const limit = maxResults === "" ? null : maxResults;
        const query = "SELECT * FROM posts ORDER BY created_at DESC LIMIT $1";

        try {
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL BY USER ID
    getPostsByUserId: async function (created_by) {

        const query = "SELECT * FROM posts WHERE created_by = $1";

        try {
            const result = await pool.query(query, [created_by]);
            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } 
    },

    // UPDATE
    updatePost: async function (id, title, category, content, banner, image, posted_draft, status, updated_by) {

        const query =
            "UPDATE posts SET title = $2, category = $3, content = $4, banner = $5, image = $6, posted_draft = $7, status = $8, updated_at = CURRENT_TIMESTAMP, updated_by = $9 WHERE id = $1";
        try {
            await pool.query(query, [id, title, category, content, banner, image, posted_draft, status, updated_by]);
            console.log("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
            throw error;
        } 
    },

    // DELETE
    deletePost: async function (id) {

        const query = "DELETE FROM posts WHERE id = $1";

        try {
            await pool.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        } 
    },
};

module.exports = postsRepository;
