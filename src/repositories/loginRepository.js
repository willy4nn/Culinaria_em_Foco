const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword');
const pool = require('../database/postgres');


//Configurações default de ambiente
const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');

const loginRepository = {

  getLogin: async (sessionToken) => {
    try {
      const decoded = await jwt.verify(sessionToken, config.SECRET_KEY);
      if (!decoded) {
        throw { error: "Token JWT inválido, faça login novamente" };
      }
      const user = decoded.user;
      const userToken = {
        id: user.id,
        username: user.username,
        name: user.name,
        userType: user.userType,
        profilePhoto: user.profilePhoto,
        premiumActive: user.premiumActive,
        sessionToken: sessionToken
      };
      return userToken;
    } catch (error) {
      throw { error: "Token JWT inválido" };
    }
  },

    getUser: async function(username) {
      try {
        const result = await pool.query(`SELECT * FROM users WHERE ${isNaN(username) ? "username" : "id"} = $1`, [username]);
        return result;
      } catch (error) {
        console.error("Não foi possível resgatar dados do usuário", error);
        throw error;
      } 
    },

    getUsers: async () => {
        try {
          const result = await pool.query('SELECT * FROM users')
          return result;
        } catch (error) {
          throw error;
        } 
          
    },

    // Carrega todos os dados do usuário logado
    getProfile: async (users_id) => {
      try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [users_id])
        return result;
      } catch (error) {
        throw error;
      } 
        
  },

    autenticate: async (email, simplePassword) => {
        try {
          //Primeiro verifica se usuário existe
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
          if(result.rowCount === 0){
            const error = { success: false, error: 'Usuário inexistente' };
            return error;
          }

          //Agora é feito o processo de autenticação, usuário ganha um token
          const user = result.rows[0];
          const hashedPassword = user.password; // Assumindo que a senha já está armazenada de forma segura no banco de dados
          const match = await comparePassword(simplePassword, hashedPassword);
          if (!match) {
            const error = { success: false, error: 'Senha incorreta' }
            return error;
          }

          //Dados do token a ser gerado
          const userToken = {
            id: user.id,
            username: user.username,
            name: user.name,
            userType: user.user_type,
            profilePhoto: user.profile_photo,
            premiumActive: user.premium_active
          }
          //Aqui é feito o processo de assinatura do token
            const sessionToken = await jwt.sign({ user: userToken }, config.SECRET_KEY);
            const success = { success: true, sessionToken: sessionToken, message: 'Token assinado com sucesso!' };
            return success;

          } catch (error) {
            console.error({ error: 'Falha durante processo de assinatura do token' });
          }
    },

    addUser: async (user) => {
      // Procedimento realiza Transação - Utilizando conexão do tipo Client
      const client = await pool.connect();
    
      const newUser = user;
      const hashedPassword = await hashPassword(newUser.password);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Aqui são feitas as validações, caso o usuário não exista ele procede com o registro
      try {
        if(newUser.username === null || newUser.username === "") {
          const error = { success: false, error: 'Campo Apelido não pode estar vazio! Por favor, digite um Apelido'};
          return error;
        }

        if (newUser.username.length > 15) {
          const error = { success: false, error: 'Limite de caracteres para Apelido atingido! (max: 15)'};
          return error;
        }

        if (!isNaN(newUser.username)) {
          const error = { success: false, error: 'Por favor, insira pelo menos uma Letra no Apelido!'};
          return error;
        }

        if(newUser.name === null || newUser.name === "") {
          const error = { success: false, error: 'Campo Nome Completo não pode estar vazio! Por favor, digite Seu Nome'};
          return error;
        }
    
        if (!emailRegex.test(newUser.email)) {
          const error = { success: false, error: 'Insira um endereço de email válido!' };
          return error;
        }

        if (newUser.password.length < 8) {
          const error = { success: false, error: 'A senha precisa ter pelo menos 8 caracteres'};
          return error;
        }
    
        const test1 = await client.query('SELECT * FROM users WHERE username = $1', [newUser.username]);
        if (test1.rowCount > 0) {
          const error = { success: false, error: 'Usuário já existe'};
          return error;
        }
    
        const test2 = await client.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
        if (test2.rowCount > 0) {
          const error = { success: false, error: 'Esse email já possui cadastro!'};
          return error;
        }
        
        await client.query('BEGIN');
      
        await client.query('INSERT INTO users (name, username, email, password, user_type, premium_active, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [newUser.name, newUser.username, newUser.email, hashedPassword, "user", false, newUser.profile_photo]);
      
        await client.query('COMMIT');
    
        const success = { success: true, message: 'Usuário cadastrado com sucesso!' };
        return success;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error("Não foi possível registrar usuário", err);
        const error = { success: false, error: "Não foi possível registrar usuário"};
        return error;
      } finally {
        client.release();
      }
    },

    updateUser: async (actualUser, userUpdate) => {
      const username = actualUser;
      const updatedUser = userUpdate;
    
    //Caso o usuário troque a senha, ela é hasheada novamente
    if (updatedUser.password){
      const hashedPassword = await hashPassword(updatedUser.password);
      updatedUser.password = hashedPassword;
    }
    //Tenta encontrar o usuário através do req.params
    //Caso a busca precise ser feita pelo id, basta apenas inseri-lo diretamente a rota normalmente
    const test1 = await pool.query(`SELECT * FROM users WHERE ${isNaN(username) ? "username" : "id"} = $1`, [username]);
    if (test1.rowCount === 0) {
      const error = {success: false, error: "Usuário não encontrado" }
      return error;
    }

    //Aqui verifica se username já existe no banco
    const test2 = await pool.query(`SELECT * FROM users WHERE "username" = $1`, [updatedUser.username]);
    if (test2.rowCount > 0 && (test1.rows[0].username !== test2.rows[0].username)) {
      const error = {success: false, error: "Apelido já existe" }
      return error;
    }

    //Procedimento realiza Transação - Utilizando conexão do tipo Client
    const client = await pool.connect()
        try {
          //Aqui cria um novo objeto com as informações novas
          const existingUser = test1.rows[0];
          const newUser = { ...existingUser, ...updatedUser };
          
          //Aqui se desenrola o processo de atualização no banco
          await client.query('BEGIN')

          await client.query(`UPDATE users SET name = $1, username = $2, email = $3, password = $4, user_type = $5, premium_active = $6, premium_date = $7, profile_photo = $8, created_at = $9 WHERE ${isNaN(username) ? "username" : "id"} = $10`, 
          [newUser.name, newUser.username, newUser.email, newUser.password, newUser.user_type, newUser.premium_active, newUser.premium_date, newUser.profile_photo, newUser.created_at, username]);

          await client.query('COMMIT')
          const success = { success: true, message: 'Usuário atualizado com sucesso!' }
          return success

          } catch (err) {
            await client.query('ROLLBACK')
            console.error("Não foi possível atualizar o usuário", err);
            const error = { success: false, error: "Não foi possível atualizar o usuário"};
            return error
        } finally {
          client.release();
        }          
    },

    deleteUser: async (username) => {
      
      //Tenta encontrar dados do usuário através do username, caso encontre o deleta permanentemente
      //Caso a busca precise ser feita pelo id, basta apenas inseri-lo diretamente a rota normalmente
        const result = await pool.query(`SELECT * FROM users WHERE ${isNaN(username) ? "username" : "id"} = $1`, [username]);
        if (result.rowCount === 0) {
          const error = {success: false, error: "Usuário não encontrado" }
          return error;
        }
        try {
          await pool.query(`DELETE FROM users WHERE ${isNaN(username) ? "username" : "id"} = $1`, [username]);
          const success = { success: true, message: "Usuário excluído com sucesso!"};
          return success;
        } catch (err) {
          console.error("Erro ao excluir usuário", err);
          const error = { success: false, error: "Erro ao excluir usuário"};
          return error;
        }
    },
}

module.exports = loginRepository;