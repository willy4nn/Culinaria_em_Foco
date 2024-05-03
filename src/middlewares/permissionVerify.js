const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.SECRET_KEY;

//Esse middleware faz a verificação do token do usuário, caso ele tenha, permite o acesso aos dados
async function permissionVerify (req, res, next){
    const token = req.cookies.session_id;
    if (!token) {
        return res.status(401).send('Token JWT ausente');
    }

    try {
        // Verifica o token JWT usando a chave secreta
        jwt.verify(token, SECRET_KEY);
        next(); // Chama o próximo middleware ou rota se o token for válido
    } catch (error) {
        // Se houver um erro ao verificar o token, envie uma resposta com o erro
        console.error('Erro ao verificar o token JWT:', error);
        res.status(401).send('Token JWT inválido');
    }
}

module.exports = permissionVerify;