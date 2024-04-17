const connectToDatabase = require("../database/postgres.js");

//COLUMNS: id, title, category, content, banner, image, posted_draft, status, likes_quantity,
//comments_quantity, created_at, updated_at, created_by, updated_by

const postsRepository = {

    // CREATE
    createPost: async function (title, category, content, banner, image, posted_draft, status, created_by, updated_by) {
        const pool = await connectToDatabase();

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
        const pool = await connectToDatabase();

        const query = "SELECT * FROM posts WHERE id = $1";

        try {
            const result = await pool.query(query, [id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getPosts: async function () {
        const pool = await connectToDatabase();

        const query = "SELECT * FROM posts";

        try {
            const result = await pool.query(query);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // UPDATE
    updatePost: async function (id, title, category, content, banner, image, posted_draft, status, updated_by) {
        const pool = await connectToDatabase();

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
        const pool = await connectToDatabase();

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
