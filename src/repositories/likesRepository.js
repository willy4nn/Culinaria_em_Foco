const pool = require("../database/postgres.js");

//title, category, content, banner, image, posted_draft, status, created_at, updated_at, created_by, updated_by

const likesRepository = {

    /** POSTS **/

    // CREATE / DELETE
    likeUnlikePost: async function (posts_id, users_id) {

        // Procedimento realiza Transação - Utilizando conexão do tipo Client
        const client = await pool.connect();
        // QUERY utilizando a TRANSAÇÃO like_unlike no banco, mais detalhes no notion.
        
        const query = "SELECT like_unlike($1, $2);";

        try {
            await client.query('BEGIN');

            const result = await client.query(query, [posts_id, users_id]);

            await client.query('COMMIT');
            console.log("Dados inseridos com sucesso!");

            return result.rows;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro ao fetuar like ou unline: ", error);
            throw error;
        } finally {
            client.release();
        }
    },

    // GET BY ID
    getPostLike: async function (id) {

        const query = "SELECT * FROM posts_likes WHERE id = $1";

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
    getPostLikes: async function () {

        const query = "SELECT * FROM posts_likes";

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

    // GET BY POST ID AND USER ID
    getPostsIsLiked: async function (posts_id, users_id) {

        const query = "SELECT * FROM posts_likes WHERE posts_id = $1 AND users_id = $2";

        try {
            const result = await pool.query(query, [posts_id, users_id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } 
    },

    /** COMMENTS **/

    // CREATE / DELETE
    likeUnlikeComment: async function (posts_comments_id, users_id) {

        // Procedimento realiza Transação - Utilizando conexão do tipo Client
        const client = await pool.connect();

        // QUERY utilizando a TRANSAÇÃO like_unlike_comments no banco, mais detalhes no notion.
        const query = `SELECT like_unlike_comments($1, $2)`;

        try {
            await client.query('BEGIN');

            const result = await client.query(query, [posts_comments_id, users_id]);
            await client.query('COMMIT');
            
            console.log("Dados inseridos com sucesso!");

            return result.rows;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
            client.release();
        }
    },

    // GET BY ID
    getCommentLike: async function (id) {

        const query = "SELECT * FROM comments_likes WHERE id = $1";

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
    getCommentlikes: async function () {

        const query = "SELECT * FROM comments_likes";

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

    // GET BY COMMENT ID AND USER ID
    getCommentsIsLiked: async function (posts_comments_id, users_id) {

        const query = "SELECT * FROM comments_likes WHERE posts_comments_id = $1 AND users_id = $2";

        try {
            const result = await pool.query(query, [posts_comments_id, users_id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } 
    },

    /** REPLIES **/

    // CREATE / DELETE
    likeUnlikeReply: async function (comments_replies_id, users_id) {

        // Procedimento realiza Transação - Utilizando conexão do tipo Client
        const client = await pool.connect();
        
        // QUERY utilizando a TRANSAÇÃO like_unlike_replies no banco, mais detalhes no notion.
        const query = `SELECT like_unlike_replies($1, $2)`;

        try {
            await client.query("BEGIN")

            const result = await client.query(query, [comments_replies_id, users_id]);
            await client.query("COMMIT")
            
            console.log("Dados inseridos com sucesso!");

            return result.rows;
        } catch (error) {
            await client.query("ROLLBACK")
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
            client.release()
        }
    },

    // GET BY ID
    getReplyLike: async function (id) {

        const query = "SELECT * FROM replies_likes WHERE id = $1";

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
    getRepliesLikes: async function () {

        const query = "SELECT * FROM replies_likes";

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

    // GET BY REPLY ID AND USER ID
    getRepliesIsLiked: async function (comments_replies_id, users_id) {

        const query = "SELECT * FROM replies_likes WHERE comments_replies_id = $1 AND users_id = $2";

        try {
            const result = await pool.query(query, [comments_replies_id, users_id]);
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