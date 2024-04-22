const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginControllers");
const permissionVerify = require("../middlewares/permissionVerify")
const adminPermissionVerify = require("../middlewares/adminPermissionVerify")
const selfPermissionVerify = require("../middlewares/selfPermissionVerify")

//Rotas de verificação do login do Usuário
router.get('/user', permissionVerify, loginController.getLogin);
router.get('/all', adminPermissionVerify, loginController.getUsers);
router.get('/user/:username', selfPermissionVerify, loginController.getUser);
router.post('/auth', loginController.autenticate);

//Rotas de Criação de conta e logout
router.post("/register", loginController.addUser);
router.post("/logout", loginController.logout);

//Rotas para atualização do login
router.put("/user/:username", selfPermissionVerify, loginController.updateUser);
router.delete("/user/:username", selfPermissionVerify, loginController.deleteUser);

module.exports = router;