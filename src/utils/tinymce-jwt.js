
const { configTinymce } = require("../config/configFile.js");
const jwt = require('jsonwebtoken');
const fs = require('fs');

function createToken(req, res) {

    console.log("passou aqui:")
    
    console.log("req", req);
    
    console.log("passou aqui:")
    // Validação de usuário aqui...
    const payload = {
        sub: '123', // Unique user id string
        name: 'Teste', // Full name of user

        // Optional custom user root path
        // 'https://claims.tiny.cloud/drive/root': '/johndoe',

        exp: Math.floor(Date.now() / 1000) + (60 * 10) // 10 minutes expiration
    };

    try {
        const privkey =  fs.readFileSync(configTinymce.TINYMCE_SECRET_KEY, 'utf8');


        console.log("chegou aqui", privkey); 
        const token = jwt.sign(payload, privkey, { algorithm: 'RS256'});
        console.log("token", token);
        res.set('content-type', 'application/json');
        res.status(200);
        
        res.send(JSON.stringify({
        token: token
        }));
    } catch (e) {
        res.status(500);
        res.send(e.message);
    }
}

module.exports = { createToken }; 