const loginRepository = require('../repositories/loginRepository');
const { mail } = require('../utils/sendMail');

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

  // Carrega todos os dados do usuário logado
  getProfile: async (req, res) => {
    const users_id = req.user.id;  
    const result = await loginRepository.getProfile(users_id);

    if (result.rowCount === 0) {
          res.status(404).json({ error: 'Usuário não encontrado' });
          return
        }
      res.status(200).json(result.rows[0]);
  },

  //Aqui é feito o processo de login, quando o usuário é autenticado ele recebe um cookie
  autenticate: async (req, res) => {

    const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Informe um Email" });
      }

      if (!password) {
        return res.status(400).json({ message: "Informe a Senha" });
      }

    const result = await loginRepository.autenticate(email, password);
      if(!result.success){
        return res.status(400).json({ message: result.error })
      }
        res.cookie('session_id', result.sessionToken, { maxAge: 36000000, httpOnly: true });
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
    const result = await loginRepository.updateUser(username, updatedUser);

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
  },

  //Aqui é feita a redefinição de senha do usuário
  forgotPassword: async (req, res) => {
    const email = req.body.email;

      const result = await loginRepository.forgotPassword(email);

      console.log("result", result);

      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      const recoveryUrl = `${req.protocol}://${req.get('host')}/recovery-password/${result.recoveryToken}`;
      console.log("recoveryUrl: ", recoveryUrl);

      const domainData = {
        protocol: req.protocol,
        host: req.get('host')
      };

      const mailResult = await mail(email, recoveryUrl, domainData);

      if(!mailResult){
        return res.status(400).json({ erro: result.error });
      }

      res.status(200).json({ result });
  },

  recoveryPassword: async (req, res) => {
    const user_id = req.user.id;
    const password = req.body.password;

    const result = await loginRepository.recoveryPassword(user_id, password);

    if (!result.success){
    return res.status(500).json({ message: result.error })
    }
      res.status(200).json({ result })
  },
}

module.exports = loginController;