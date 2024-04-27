const connectToDatabase = require("../database/postgres.js");

//title, category, content, banner, image, posted_draft, status, created_at, updated_at, created_by, updated_by

const likesRepository = {

    /** POSTS **/

    // CREATE / DELETE
    likeUnlikePost: async function (posts_id, users_id) {
        const pool = await connectToDatabase.connect();

        // QUERY utilizando a TRANSAÇÃO like_unlike no banco, mais detalhes no notion.
        const query = "SELECT like_unlike($1, $2);";

        try {
            const result = await pool.query(query, [posts_id, users_id]);
            console.log("Dados inseridos com sucesso!");

            return result.rows;
        } catch (error) {
            console.error("Erro ao fetuar like ou unline: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // GET BY ID
    getPostLike: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM posts_likes WHERE id = $1";

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

    // GET ALL
    getPostLikes: async function () {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM posts_likes";

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

    // GET BY POST ID AND USER ID
    getPostsIsLiked: async function (posts_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM posts_likes WHERE posts_id = $1 AND users_id = $2";

        try {
            const result = await pool.query(query, [posts_id, users_id]);
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

    /** COMMENTS **/

    // CREATE / DELETE
    likeUnlikeComment: async function (posts_comments_id, users_id) {
        const pool = await connectToDatabase.connect();
        
        // QUERY utilizando a TRANSAÇÃO like_unlike_comments no banco, mais detalhes no notion.
        const query = `SELECT like_unlike_comments($1, $2)`;

        try {
            const result = await pool.query(query, [posts_comments_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            
            return result.rows;
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // GET BY ID
    getCommentLike: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM comments_likes WHERE id = $1";

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

    // GET ALL
    getCommentlikes: async function () {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM comments_likes";

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

    // GET BY COMMENT ID AND USER ID
    getCommentsIsLiked: async function (posts_comments_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM comments_likes WHERE posts_comments_id = $1 AND users_id = $2";

        try {
            const result = await pool.query(query, [posts_comments_id, users_id]);
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

    /** REPLIES **/

    // CREATE / DELETE
    likeUnlikeReply: async function (comments_replies_id, users_id) {
        const pool = await connectToDatabase.connect();
        
        // QUERY utilizando a TRANSAÇÃO like_unlike_replies no banco, mais detalhes no notion.
        const query = `SELECT like_unlike_replies($1, $2)`;

        try {
            const result = await pool.query(query, [comments_replies_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            
            return result.rows;
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
    },

    // GET BY ID
    getReplyLike: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM replies_likes WHERE id = $1";

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

    // GET ALL
    getRepliesLikes: async function () {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM replies_likes";

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

    // GET BY REPLY ID AND USER ID
    getRepliesIsLiked: async function (comments_replies_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM replies_likes WHERE comments_replies_id = $1 AND users_id = $2";

        try {
            const result = await pool.query(query, [comments_replies_id, users_id]);
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

};

module.exports = likesRepository;
