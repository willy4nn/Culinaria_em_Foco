const connectToDatabase = require("../database/postgres.js");

//COLUMNS: id, user_id, post_id

const favoritePostsRepository = {

    // CREATE
    createFavoritePost: async function (users_id, posts_id) {
        const pool = await connectToDatabase.connect();

        const query = `INSERT INTO favorite_posts (users_id, posts_id) VALUES ($1, $2) RETURNING *`;

        try {
            const result = await pool.query(query, [
                users_id,
                posts_id,
            ]);
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
    getFavoritePost: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM favorite_posts WHERE id = $1";

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
    getFavoritePosts: async function () {
        const pool = await connectToDatabase.connect();

        const query = "SELECT * FROM favorite_posts";

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

    // NO UPDATE

    // DELETE
    deleteFavoritePost: async function (id) {
        const pool = await connectToDatabase.connect();

        const query = "DELETE FROM favorite_posts WHERE id = $1";

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

module.exports = favoritePostsRepository;
