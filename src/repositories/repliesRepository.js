const pool = require("../database/postgres.js");

const repliesRepository = {
    // CREATE
    createReply: async function (posts_comments_id, users_id, content) {

        const query = `SELECT create_reply($1, $2, $3);`;

        try {
            const result = await pool.query(query, [posts_comments_id, users_id, content]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;
            
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // GET all replies by comment ID and JOIN with users name and profile_photo
    getRepliesByCommentId: async function (posts_comments_id) {

        const query = "SELECT comments_replies.*, users.name, users.profile_photo FROM comments_replies JOIN users ON comments_replies.users_id = users.id WHERE comments_replies.posts_comments_id = $1";

        try {
            const result = await pool.query(query, [posts_comments_id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getReplies: async function () {

        const query = "SELECT * FROM comments_replies";

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
    getReply: async function (id) {

        const query = "SELECT * FROM comments_replies WHERE id = $1";

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
    updateReply: async function (id, content) {

        const query = "UPDATE comments_replies SET content = $2 WHERE id = $1 RETURNING *";
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
    deleteReply: async function (id) {

        const query = "DELETE FROM comments_replies WHERE id = $1";

        try {
            await pool.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        }
    },
};

module.exports = repliesRepository;
