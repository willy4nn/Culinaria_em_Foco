const { Pool } = require("pg");
const { configDatabase } = require("../config/configFile.js");

// Configurações de conexão com o banco de dados
const connectToDatabase = () => {
  const pool = new Pool({
    user: configDatabase.DB_USERNAME,
    host: configDatabase.HOST,
    database: configDatabase.DATABASE,
    password: configDatabase.PASSWORD,
    port: 5432,
    max: 20,
    connectionTimeoutMillis: 120000,
    idleTimeoutMillis: 60000,
    allowExitOnIdle: true,
  });
  pool
    .connect()
    .then(() => console.log("Conexão bem-sucedida"))
    .catch((err) => console.error("Erro ao conectar:", err));

  return pool;
};

module.exports = connectToDatabase;