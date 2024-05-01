const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.SECRET_KEY;

//Esse middleware verifica se o proprio usuário quem está fazendo a solicitação para si, ou se é um admin
async function selfPermissionVerify(req, res, next) {
    const sessionToken = req.cookies.session_id;
    const selfUsername = req.params.username;

    await jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token JWT inválido" });
      } 
        const userName = decoded.user.username;
        const userType = decoded.user.userType;
        const userId = decoded.user.id;

        if (userName === selfUsername|| userId == selfUsername || userType === "admin") {
          req.user = decoded.user;
          next();
        } else {
          return res.status(403).json({ error: "Permissão de administrador necessária" });
        }
      }
    );
  }
  
  module.exports = selfPermissionVerify;