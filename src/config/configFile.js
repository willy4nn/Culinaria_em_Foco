require("dotenv").config();

//Configurações default
const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    HOST: process.env.HOST || "127.0.0.1",
    PORT: process.env.PORT || 3000,
    SECRET_KEY: process.env.SECRET_KEY || "aceita_que_doi_menos",
};

//Configurações Banco de Dados
const configDatabase = {
    HOST: process.env.DB_HOST || "127.0.0.1",
    DB_USERNAME: process.env.DB_USERNAME || "joaozinho",
    PASSWORD: process.env.PASSWORD || "senha123",
    DATABASE: process.env.DATABASE || "meu_banco",
};

module.exports = { config, configDatabase };