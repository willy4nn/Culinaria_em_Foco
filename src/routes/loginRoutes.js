const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginControllers');

//Rotas de verificação do login do Usuário
router.get('/user', loginController.getLogin);
router.get('/all', loginController.getUsers);
router.get('/:username', loginController.getUser);
router.post('/auth', loginController.autenticate);

//Rotas de Criação de conta e logout
router.post('/register', loginController.addUser);
router.post('/logout', loginController.logout);

//Rotas para atualização do login
router.put('/user/:username', loginController.updateUser);
router.delete('/user/:username', loginController.deleteUser);

module.exports = router;