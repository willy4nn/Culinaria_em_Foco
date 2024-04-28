const loginRepository = require('../repositories/loginRepository')

const loginController = {

//Aqui o sistema pega os dado do cookie e verifica se o usuário está logado 
//E responde com os dados de login para exibição no front
getLogin: async (req, res) => {
  const sessionToken = req.cookies.session_id;
  const userToken = await loginRepository.getLogin(sessionToken);
  res.status(200).json(userToken);
},

//Aqui pega os dados gerais de um usuário em específico e os exibe
//Somente admins tem acesso aos dados
getUser: async (req, res) => {
  const username = req.params.username;  
  const result = await loginRepository.getUser(username);

  if (result.rowCount === 0) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return
      }
    res.status(200).json(result.rows[0]);
},

//Aqui pega os dados de todos os usuários cadastrados no sitema e os exibe
//Somente admins tem acesso aos dados
getUsers: async (req, res) => {
    
  try {
      const result = await loginRepository.getUsers();
      res.status(200).json(result.rows);
      } catch (error) {
          res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
},

//Aqui é feito o processo de login, quando o usuário é autenticado ele recebe um cookie
autenticate: async (req, res) => {

  const { email, password } = req.body;

  const error = "Usuário e/ou senha inválidos!";
    if (!email || !password) {
      return res.status(400).json({ error });
    }
  const result = await loginRepository.autenticate(email, password);
    if(!result.success){
      return res.status(400).json({ message: result.error })
    }
      res.cookie('session_id', result.sessionToken, { maxAge: 1800000, httpOnly: true });
      res.status(200).json({ message: result.message });
},

logout: (req, res) => {
  res.clearCookie('session_id');
  res.json({message: "Token excluido com sucesso!"});
},

//Aqui é feita a criação do usuário
addUser: async (req, res) => {
  const newUser = req.body;

    //Aqui é feito o registro do usuário no banco de dados com a senha hasheada
    const result = await loginRepository.addUser(newUser)

    if(!result.success){
      return res.status(400).json({ message: result.error });
    }

    res.status(201).json({ message: 'Usuário adicionado com sucesso' });
},

updateUser: async (req, res) => {
  const username = req.params.username;
  const updatedUser = req.body;
  const result = await loginRepository.updateUser(username, updatedUser)

  if (!result.success){
   return res.status(500).json({ message: result.error })
  }
    res.status(200).json({ message: result.message })
},

deleteUser: async (req, res) => {
  const username = req.params.username;
  const result = await loginRepository.deleteUser(username)
  if(!result.success){
    return res.status(500).json({ result })
  }
    res.status(200).json({ result })
  }
}

module.exports = loginController;