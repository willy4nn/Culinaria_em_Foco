const connectToDatabase = require("../database/postgres.js");

const repliesRepository = {
    // CREATE
    createReply: async function (posts_comments_id, users_id, content) {
        const pool = await connectToDatabase.connect();

        const query = `INSERT INTO comments_replies (posts_comments_id, users_id, content) VALUES ($1, $2, $3) RETURNING *`;

        try {
            const result = await pool.query(query, [posts_comments_id, users_id, content]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;
            
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // GET all replies by comment ID and JOIN with users name and profile_photo
    getRepliesByCommentId: async function (posts_comments_id) {
        const pool = await connectToDatabase.connect();
        console.log("é aqui mesmo")

        const query = "SELECT comments_replies.*, users.name, users.profile_photo FROM comments_replies JOIN users ON comments_replies.users_id = users.id WHERE comments_replies.posts_comments_id = $1";

        try {
            const result = await pool.query(query, [posts_comments_id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // GET ALL
    getReplies: async function () {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM comments_replies";

        try {
            const result = await pool.query(query);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // GET BY ID
    getReply: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM comments_replies WHERE id = $1";

        try {
            const result = await pool.query(query, [id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // UPDATE
    updateReply: async function (id, content) {
        const pool = await connectToDatabase.connect();

        const query = "UPDATE comments_replies SET content = $2 WHERE id = $1 RETURNING *";
        try {
            const result = await pool.query(query, [id, content]);
            console.log("Dados atualizados com sucesso!");

            return result.rows;
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // DELETE
    deleteReply: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "DELETE FROM comments_replies WHERE id = $1";

        try {
            await pool.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },
};

module.exports = repliesRepository;
