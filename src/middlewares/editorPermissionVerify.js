const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.SECRET_KEY;

//Esse middleware verifica se o proprio usuário quem está fazendo a solicitação para si, ou se é um admin
async function editorPermissionVerify(req, res, next) {
    const sessionToken = req.cookies.session_id;

    await jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token JWT inválido" });
      } 
        const userType = decoded.user.userType;

        if (userType === "user") {
          return res.status(403).json({ error: "Não autorizado!" });
        } 
          req.user = decoded.user;
          next();
      }
    );
  }
  
  module.exports = editorPermissionVerify;