const connectToDatabase = require("../database/postgres.js");

//title, category, content, banner, image, posted_draft, status, created_at, updated_at, created_by, updated_by

const likesRepository = {

    /** POSTS **/

    // CREATE
    likePost: async function (posts_id, users_id) {
        const client = await connectToDatabase();

        const query = `INSERT INTO posts_likes (posts_id, users_id) VALUES ($1, $2) RETURNING *`;

        try {
            const result = await client.query(query, [posts_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;

        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // DELETE
    unlikePost: async function (id) {
        const client = await connectToDatabase();

        const query = "DELETE FROM posts_likes WHERE id = $1";
        console.log("query", query);

        try {
            await client.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        }
    },

    // GET BY ID
    getPostLike: async function (id) {
        const client = await connectToDatabase();

        const query = "SELECT * FROM posts_likes WHERE id = $1";

        try {
            const result = await client.query(query, [id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getPostLikes: async function () {
        const client = await connectToDatabase();

        const query = "SELECT * FROM posts_likes";

        try {
            const result = await client.query(query);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    /** COMMENTS **/

    // INSERT
    likeComment: async function (posts_comments_id, users_id) {
        const client = await connectToDatabase();

        const query = `INSERT INTO comments_likes (posts_comments_id, users_id) VALUES ($1, $2) RETURNING *`;

        try {
            const result = await client.query(query, [posts_comments_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;

        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // DELETE
    unlikeComment: async function (id) {
        const client = await connectToDatabase();

        const query = "DELETE FROM comments_likes WHERE id = $1";
        console.log("query", query);

        try {
            await client.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        }
    },

    // GET BY ID
    getCommentLike: async function (id) {
        const client = await connectToDatabase();

        const query = "SELECT * FROM comments_likes WHERE id = $1";

        try {
            const result = await client.query(query, [id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getCommentlikes: async function () {
        const client = await connectToDatabase();

        const query = "SELECT * FROM comments_likes";

        try {
            const result = await client.query(query);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

/** REPLIES **/

    // INSERT
    likeReply: async function (comments_replies_id, users_id) {
        const client = await connectToDatabase();

        const query = `INSERT INTO replies_likes (comments_replies_id, users_id) VALUES ($1, $2) RETURNING *`;

        try {
            const result = await client.query(query, [comments_replies_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            return result.rows;

        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // DELETE
    unlikeReply: async function (id) {
        const client = await connectToDatabase();

        const query = "DELETE FROM replies_likes WHERE id = $1";
        console.log("query", query);

        try {
            await client.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        }
    },

    // GET BY ID
    getReplyLike: async function (id) {
        const client = await connectToDatabase();

        const query = "SELECT * FROM replies_likes WHERE id = $1";

        try {
            const result = await client.query(query, [id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },

    // GET ALL
    getRepliesLikes: async function () {
        const client = await connectToDatabase();

        const query = "SELECT * FROM replies_likes";

        try {
            const result = await client.query(query);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        }
    },



    
};

module.exports = likesRepository;