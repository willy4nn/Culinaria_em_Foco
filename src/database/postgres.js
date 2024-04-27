const { Pool } = require("pg");
const { configDatabase } = require("../config/configFile.js");

// Configurações de conexão com o banco de dados
  const pool = new Pool({
    user: configDatabase.DB_USERNAME,
    host: configDatabase.HOST,
    database: configDatabase.DATABASE,
    password: configDatabase.PASSWORD,
    port: 5432,
  });

module.exports = pool;