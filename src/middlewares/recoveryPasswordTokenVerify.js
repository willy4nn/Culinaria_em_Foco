const { configMail } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const MAIL_SECRET_KEY = configMail.MAIL_SECRET_KEY;

//Esse middleware verifica se o usuário tem permissão de "admin", caso ele tenha, permite o acesso
async function recoveryPasswordPermissionVerify(req, res, next) {
    const token = req.params.token;


    if (!token) {
      return res.status(401).json({ message: "Requisição inválida, solicite uma redefinição senha" });
    }
  
    await jwt.verify(token, MAIL_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Link expirado ou inválido, favor solicitar um novo" });
      } 
      console.log(decoded);
  
      req.user = decoded.user;
      next();
      }
    );
  }
  
  module.exports = recoveryPasswordPermissionVerify;