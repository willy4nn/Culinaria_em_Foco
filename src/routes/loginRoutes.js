const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginControllers");
const permissionVerify = require("../middlewares/permissionVerify")
const adminPermissionVerify = require("../middlewares/adminPermissionVerify")

//Rotas de verificação do login do Usuário

router.get('/user', permissionVerify, loginController.getLogin);
router.get('/all', adminPermissionVerify, loginController.getUsers);
router.get('/:username', adminPermissionVerify, loginController.getUser);
router.post('/auth', loginController.autenticate);

//Rotas de Criação de conta e logout
router.post("/register", loginController.addUser);
router.post("/logout", loginController.logout);

//Rotas para atualização do login
router.put("/user/:username", adminPermissionVerify, loginController.updateUser);
router.delete("/user/:username", adminPermissionVerify, loginController.deleteUser);

module.exports = router;