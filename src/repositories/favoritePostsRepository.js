const pool = require("../database/postgres.js");

//COLUMNS: id, user_id, post_id

const favoritePostsRepository = {

    // CREATE // DELETE
    createFavoritePost: async function (posts_id, users_id) {

        // Procedimento realiza Transação - Utilizando conexão do tipo Client
        const client = await pool.connect();

        // QUERY utilizando a FUNCTION favorite_unfavorite, mais detalhes no notion.
        const query = `SELECT favorite_unfavorite($1, $2);`;

        try {
            await client.query("BEGIN")

            const result = await client.query(query, [posts_id, users_id,]);
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
    getFavoritePost: async function (id) {

        const query = "SELECT * FROM favorite_posts WHERE id = $1";

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
    getFavoritePosts: async function () {

        //const query = "SELECT * FROM favorite_posts";
        const query = "SELECT fp.* FROM favorite_posts fp JOIN posts p ON fp.posts_id = p.id WHERE p.status != 'deleted';";

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

    // GET BY POST AND USER ID
    getIsFavorited: async function (posts_id, users_id) {

        const query = "SELECT * FROM favorite_posts WHERE posts_id = $1 AND users_id = $2";

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

    // GET ALL POSTS FAVORITED BY A USER
    getPostsFavorited: async function (users_id) {

        //const query = "SELECT p.* FROM posts p INNER JOIN favorite_posts fp ON p.id = fp.posts_id WHERE fp.users_id = $1;"
        const query = "SELECT p.* FROM posts p INNER JOIN favorite_posts fp ON p.id = fp.posts_id WHERE fp.users_id = $1 AND p.status != 'deleted';"

        try {
            const result = await pool.query(query, [users_id]);
            console.log("Registros encontrados: ");
            console.table(result.rows);

            return result.rows;
        } catch (error) {
            console.error("Erro ao selecionar dados: ", error);
            throw error;
        } 
    },

    // NO UPDATE

    // DELETE
    deleteFavoritePost: async function (id) {

        const query = "DELETE FROM favorite_posts WHERE id = $1";

        try {
            await pool.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        } 
    },
};

module.exports = favoritePostsRepository;
