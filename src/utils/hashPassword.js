const bcrypt = require('bcrypt');

const hashPassword = async (password)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error("Erro ao gerar o hash da senha:", error);
        return false;
    }
}
module.exports = hashPassword;