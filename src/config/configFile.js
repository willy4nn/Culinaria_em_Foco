require("dotenv").config();

//Configurações default
const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    HOST: process.env.HOST || "127.0.0.1",
    PORT: process.env.PORT || 3000,
    PORT_SSL: process.env.PORT_SSL || 443,
    SECRET_KEY: process.env.SECRET_KEY || "aceita_que_doi_menos",
    SSL_KEY: process.env.SSL_KEY || "Jesus_é_a_chave_para_o_sucesso.pem",
    SSL_CERT: process.env.SSL_CERT || "certifico_que_o_site.pem",
};

//Configurações Banco de Dados
const configDatabase = {
    HOST: process.env.DB_HOST || "127.0.0.1",
    DB_USERNAME: process.env.DB_USERNAME || "joaozinho",
    PASSWORD: process.env.PASSWORD || "senha123",
    DATABASE: process.env.DATABASE || "meu_banco",
};

module.exports = { config, configDatabase };