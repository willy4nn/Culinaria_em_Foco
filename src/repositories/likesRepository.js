const connectToDatabase = require("../database/postgres.js");

//title, category, content, banner, image, posted_draft, status, created_at, updated_at, created_by, updated_by

const likesRepository = {

    /** POSTS **/

    // CREATE / DELETE
    likeUnlikePost: async function (posts_id, users_id) {
        const pool = await connectToDatabase.connect();

        // QUERY utilizando a FUNCTION like_unlike, mais detalhes no notion.
        const query = "SELECT like_unlike($1, $2);";

        try {
            const result = await pool.query(query, [posts_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            //return result.rows;
            return(result.rows);
  

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
    getIsLiked: async function (posts_id, users_id) {
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

    // INSERT
    likeComment: async function (posts_comments_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = `INSERT INTO comments_likes (posts_comments_id, users_id) VALUES ($1, $2) RETURNING *`;
        const response = [];

        try {
            const result = await pool.query(query, [posts_comments_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            //return result.rows;
            response.push(result.rows);
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }

        const queryPostsComments = "UPDATE posts_comments SET likes_quantity = likes_quantity + 1 WHERE id = $1";
        
        try {
            const result = await pool.query(queryPostsComments, [posts_comments_id]);
            console.log("Dados atualizados com sucesso!");
            //return result.rows;
            response.push(result.rows);
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }

        return response;
    },

    // PUT (delete)
    unlikeComment: async function (posts_comments_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = "DELETE FROM comments_likes WHERE posts_comments_id = $1 AND users_id = $2";
        console.log("query", query);

        try {
            await pool.query(query, [posts_comments_id, users_id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }

        const queryPostsComments = "UPDATE posts_comments SET likes_quantity = likes_quantity - 1 WHERE id = $1";
        try {
            const result = await pool.query(queryPostsComments, [posts_comments_id]);
            console.log("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
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

/** REPLIES **/

    // INSERT
    likeReply: async function (comments_replies_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = `INSERT INTO replies_likes (comments_replies_id, users_id) VALUES ($1, $2) RETURNING *`;
        const response = [];

        try {
            const result = await pool.query(query, [comments_replies_id, users_id]);
            console.log("Dados inseridos com sucesso!");
            //return result.rows;
            response.push(result.rows);

        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }

        const queryRepliesComments = "UPDATE comments_replies SET likes_quantity = likes_quantity + 1 WHERE id = $1";

        try {
            const result = await pool.query(queryRepliesComments, [comments_replies_id]);
            console.log("Dados atualizados com sucesso!");
            //return result.rows;
            response.push(result.rows);

        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }

        return response;
    },

    // PUT (delete)
    unlikeReply: async function (comments_replies_id, users_id) {
        const pool = await connectToDatabase.connect();

        const query = "DELETE FROM replies_likes WHERE comments_replies_id = $1 AND users_id = $2";
        console.log("query", query);

        try {
            await pool.query(query, [comments_replies_id, users_id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        } finally {
          (await pool).release
        }
        
        const queryRepliesComments = "UPDATE comments_replies SET likes_quantity = likes_quantity - 1 WHERE id = $1";
    
        try {
            await pool.query(queryRepliesComments, [comments_replies_id]);
            console.log("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
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

};

module.exports = likesRepository;
