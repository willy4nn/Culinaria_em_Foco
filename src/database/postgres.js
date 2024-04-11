const { Client } = require('pg');
const { configDatabase } = require('../config/configFile');

//Configurações de conexão com o banco de dados
const conectToDatabase = () =>{
    const client = new Client({
        user: configDatabase.USERNAME,
        host: configDatabase.HOST,
        database: configDatabase.DATABASE,
        password: configDatabase.PASSWORD,
        port: 5432
    });

    client.connect()
    .then(()=> console.log('Conexão bem Sucedida'))
    .catch(err => console.error('Erro ao conectar:', err))

    return client;
};
    
module.exports = conectToDatabase;