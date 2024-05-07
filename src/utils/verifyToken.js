const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.SECRET_KEY;

//Essa função foi concebia da fim de 
//verificar o token que é enviado ao usuário por email 
//quando é feito a solicitação de recuperação de senha
async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token, SECRET_KEY);
    const result = { success: true, message: "Solicitação em andamento", userData: decoded.user };
    return result;
  } catch (err) {
    const result = { success: false, error: "Código inválido" };
    console.error("Código Inválido", err);
    return result;
  }
}

module.exports = verifyToken;