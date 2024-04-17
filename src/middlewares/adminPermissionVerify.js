const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.SECRET_KEY;

//Esse middleware verifica se o usuário tem permissão de "admin", caso ele tenha, permite o acesso
async function adminPermissionVerify(req, res, next) {
    const sessionToken = req.cookies.session_id;
    if (!sessionToken) {
      return res.status(401).json({ error: "Token JWT ausente" });
    }
  
    await jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Token JWT inválido" });
      } 
        const userType = decoded.user.userType;
        if (userType !== "admin") {
          return res.status(403).json({ error: "Permissão de administrador necessária" });
        } else {
          req.user = decoded.user;
          next();
        }
      }
    );
  }
  
  module.exports = adminPermissionVerify;