const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = config.SECRET_KEY;

//Esse middleware faz a verificação do token do usuário, caso ele tenha, permite o acesso aos dados
async function permissionVerify (req, res, next){
    const sessionToken = req.cookies.session_id;
    if(!sessionToken){
        return res.status(401).redirect("/");
    }

    await jwt.verify(sessionToken, SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(403).redirect("/");
        }
            req.user = decoded.user;
            next();
    });
}

module.exports = permissionVerify;