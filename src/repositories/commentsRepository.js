const pool = require("../database/postgres.js");

const commentsRepository = {
    
    // CREATE
    createComment: async function (posts_id, users_id, content) {

        const query = `SELECT create_comment($1, $2, $3);`;

        try {
            const result = await pool.query(query, [posts_id, users_id, content]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;
            
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // GET all comments by post ID and JOIN with users name and profile_photo
    getCommentsByPostId: async function (posts_id) {

        const query = "SELECT posts_comments.*, users.name, users.profile_photo FROM posts_comments JOIN users ON posts_comments.users_id = users.id WHERE posts_comments.posts_id = $1";

        try {
            const result = await pool.query(query, [posts_id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getComments: async function () {

        const query = "SELECT * FROM posts_comments";

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

    // GET BY ID
    getComment: async function (id) {

        const query = "SELECT * FROM posts_comments WHERE id = $1";

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

    // UPDATE
    updateComment: async function (id, content) {

        const query = "UPDATE posts_comments SET content = $2 WHERE id = $1 RETURNING *";

        try {
            const result = await pool.query(query, [id, content]);
            console.log("Dados atualizados com sucesso!");

            return result.rows;
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
            throw error;
        }
    },

    // DELETE
    deleteComment: async function (id) {

        const query = "DELETE FROM posts_comments WHERE id = $1";

        try {
            await pool.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        }
    },
};

module.exports = commentsRepository;
