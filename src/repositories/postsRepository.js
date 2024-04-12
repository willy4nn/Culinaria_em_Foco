const connectToDatabase = require("../database/postgres.js");

//title, category, content, banner, image, posted_draft, status, created_at, updated_at, created_by, updated_by

const postsRepository = {
    // INSERT
    insertData: async function (title, category, content, banner, image, posted_draft, status, created_by, updated_by) {
        const client = await connectToDatabase();

        const query = `INSERT INTO posts (title, category, content, banner, image, posted_draft, status, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

        try {
            await client.query(query, [
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
        } catch (error) {
            console.error("Erro ao inserir dados: ", error);
            throw error;
        }
    },

    // SELECT
    selectData: async function () {
        console.log("chegou aqui");
        const client = await connectToDatabase();
        console.log("passou");

        const query = "SELECT * FROM posts";

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

    // UPDATE
    updateData: async function (id, title, category, content, banner, image, posted_draft, status, updated_by) {
        const client = await connectToDatabase();

        console.log("status", status);
        console.log("up", updated_by);

        const query =
            //"UPDATE posts SET title = $2, category = $3, content = $4, banner = $5, image = $6, posted_draft = $7, status = $8, updated_at = $9, updated_by = $10 WHERE id = $1";
            "UPDATE posts SET title = $2, category = $3, content = $4, banner = $5, image = $6, posted_draft = $7, status = $8, updated_at = CURRENT_TIMESTAMP, updated_by = $9 WHERE id = $1";
        console.log("query", query);
        try {
            await client.query(query, [id, title, category, content, banner, image, posted_draft, status, updated_by,
            ]);
            console.log("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar dados: ", error);
            throw error;
        }
    },

    // DELETE
    deleteData: async function (id) {
        const client = await connectToDatabase();

        const query = "DELETE FROM posts WHERE id = $1";
        console.log("query", query);

        try {
            await client.query(query, [id]);
            console.log("Dados excluídos com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir dados: ", error);
            throw error;
        }
    },
};

module.exports = postsRepository;
