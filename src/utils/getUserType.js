const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');

//Função que resgata o array de usertype
const getUserType = (sessionToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(sessionToken, config.SECRET_KEY, (err, decoded) => {
        if (err) {
          reject("Token JWT inválido");
        } else {
          if (!decoded) {
            reject("Token JWT inválido, faça login novamente");
          }
          resolve(decoded.user.userType);
        }
      });
    });
  };
  module.exports = getUserType;