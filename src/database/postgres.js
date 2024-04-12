const { Client } = require("pg");
const { configDatabase } = require("../config/configFile.js");

//Configurações de conexão com o banco de dados
const conectToDatabase = () => {
    console.log("oioi");
    console.log(configDatabase.DB_USERNAME, configDatabase.HOST, configDatabase.DATABASE, configDatabase.PASSWORD);
    const client = new Client({
        user: configDatabase.DB_USERNAME,
        host: configDatabase.HOST,
        database: configDatabase.DATABASE,
        password: configDatabase.PASSWORD,
        port: 5432,
    });

    client
        .connect()
        .then(() => console.log("Conexão bem Sucedida"))
        .catch((err) => console.error("Erro ao conectar:", err));

    return client;
};

module.exports = conectToDatabase;
