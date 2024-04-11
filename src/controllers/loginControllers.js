const conectToDatabase = require('../database/postgres');
const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword');

//Configurações default de ambiente
const { config } = require('../config/configFile');
const jwt = require('jsonwebtoken');

//Função que resgata o array de usertype
const getUserType = require('../utils/getUserType');


//Aqui o sistema pega os dado do cookie e verifica se o usuário está logado 
//E responde com os dados de login para exibição no front
const getLogin = async (req, res) => {
  const sessionToken = req.cookies.session_id;
  const user = await jwt.verify(sessionToken, config.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token JWT inválido" });
    } else {
      if (!decoded) {
        return res.status(403).json({ error: "Token JWT inválido, faça login novamente" }).clearCookie('session_id');
      }
      return decoded.user;
    }
  });
  const userToken = { username: user.username, name: user.name, sessionToken: sessionToken };
  res.status(200).json(userToken);
};


//Aqui pega os dados gerais de um usuário em específico e os exibe
//Somente admins tem acesso aos dados
const getUser = async (req, res) => {
  const client = conectToDatabase();
  const sessionToken = req.cookies.session_id;
  const userType = await getUserType(sessionToken);

  const username = req.params.username;

  if (userType.includes("admin") && sessionToken) {
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    } finally {
        await client.end();
    }
  } else {
    res.status(403).json({ error: 'Acesso negado!' });
  }
};

//Aqui pega os dados de todos os usuários cadastrados no sitema e os exibe
//Somente admins tem acesso aos dados
const getUsers = async (req, res) => {
  const client = conectToDatabase();
  const sessionToken = req.cookies.session_id;
  const userType = await getUserType(sessionToken);

  if (userType.includes("admin") && sessionToken) {
    try {
      const result = await client.query('SELECT * FROM users');
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    } finally {
        await client.end();
    }
  } else {
    res.status(403).json({ error: 'Acesso negado!' });
  }

  client.end();
};


//Aqui é feito o processo de login, quando o usuário é autenticado ele recebe um cookie
const autenticate = async (req, res) => {
  const client = conectToDatabase();
  const { username, password } = req.body;

  const error = "Usuário e/ou senha inválidos!";
  if (!username || !password) {
    return res.status(400).json({ error });
  }

  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error });
    }

    const user = result.rows[0];
    const hashedPassword = user.password; // Assumindo que a senha já está armazenada de forma segura no banco de dados
    const match = await comparePassword(password, hashedPassword);
    if (!match) {
      return res.status(400).json({ error });
    }

    const userToken = {
      username: user.username,
      name: user.name,
      userType: user.user_type
    };

    try {
      const sessionToken = await jwt.sign({ user: userToken }, config.SECRET_KEY);
      res.cookie('session_id', sessionToken, { maxAge: 900000, httpOnly: true });
      user.sessionToken = sessionToken;

      // Atualizar o usuário no banco de dados não é necessário neste caso, pois a senha não está sendo alterada
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao gerar token JWT" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  } finally {
    await client.end();
  }
};

const logout = (req, res) => {
  res.clearCookie('session_id');
  res.json({ success: true });
};


//Aqui é feita a criação do usuário
const addUser = async (req, res) => {
  const client = conectToDatabase();
  const newUser = req.body;
  if (!newUser.user_type) {
    newUser.user_type = "user";
  }
  const newUsername = newUser.username;
  const hashedPassword = await hashPassword(newUser.password);
  
  //Aqui é feito a verificação, caso o usuário não exista ele procede com o registro
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [newUsername]);
    if (result.rowCount > 0) {
      res.status(400).json({ error: 'Usuário já existe' });
      return;
    }

    //Aqui é feito o registro do usuário no banco de dados com a senha hasheada
    await client.query('INSERT INTO users (name, username, email, password, user_type, premium_active, premium_date, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
     [newUser.name, newUser.username, newUser.email, hashedPassword, newUser.user_type, newUser.premium_active, newUser.premium_date, newUser.profile_photo]);

    res.status(201).json({ message: 'Usuário adicionado com sucesso' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao adicionar usuário' });
  }

  await client.end();
};

const updateUser = async (req, res) => {
  const client = conectToDatabase();
  const sessionToken = req.cookies.session_id;
  const userType = await getUserType(sessionToken);

  if (sessionToken && userType.includes('admin')) {
    const username = req.params.username;
    const updatedUser = req.body;

    //Caso o usuário troque a senha, ela é hasheada novamente
    if (updatedUser.password){
        const hashedPassword = await hashPassword(updatedUser.password);
        updatedUser.password = hashedPassword;
    }

    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      const existingUser = result.rows[0];
      const newUser = { ...existingUser, ...updatedUser };

      await client.query('UPDATE users SET name = $1, username = $2, email = $3, password = $4, user_type = $5, premium_active = $6, premium_date = $7, profile_photo = $8, created_at = $9 WHERE username = $10', [newUser.name, newUser.username, newUser.email, newUser.password, newUser.user_type, newUser.premium_active, newUser.premium_date, newUser.profile_photo, newUser.created_at, username]);

      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    } finally {
        await client.end();
    }
  } else {
    res.status(403).json({ error: 'Acesso negado!' });
  }
};

const deleteUser = async (req, res) => {
  const client = conectToDatabase();
    const sessionToken = req.cookies.session_id;
    const userType = await getUserType(sessionToken);
  
    if (sessionToken && userType.includes('admin')) {
      const username = req.params.username;
  
      try {
        await client.query('DELETE FROM users WHERE username = $1', [username]);
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir usuário' });
      } finally {
        await client.end();
      }
    } else {
      res.status(403).json({ error: 'Acesso negado!' });
    }
};


module.exports = {
  getLogin,
  getUser,
  getUsers,
  autenticate,
  logout,
  addUser,
  updateUser,
  deleteUser
};