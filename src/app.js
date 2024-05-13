const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');

const fs = require('fs');

const app = express();
const port = config.PORT;
const host = config.HOST;

//Essa variável determina o ambiente em que o sistema está rodando // development | production
const environment = config.NODE_ENV;

// Middleware para analisar o corpo das requisições JSON
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware para lidar com os cookies
app.use(cookieParser());

// Middleware cors para habilitar a política de CORS
app.use(cors({ origin: 'http://localhost' }));

// Middleware para adicionar o cabeçalho X-Frame-Options
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Middlewares que verificam se usuario está logado e seus derivados cargos
const permissionVerify = require("./middlewares/permissionVerify.js")
const adminPermissionVerify = require("./middlewares/adminPermissionVerify.js")
const editorPermissionVerify = require("./middlewares/editorPermissionVerify.js")

//Base de rotas da API
const routes = require('./routes');
app.use('/api', routes);

//Aqui é a parte que separa os ambientes para se trabalhar

if(environment === "development"){

  // Define o caminho absoluto para a pasta "public"
  const publicPath = path.join(__dirname, '../public');

  //Servidor ssl para trabalhar localmente
  const https = require('https');
  
  //Porta ssl para trabalhar localmente
  const port_ssl = config.PORT_SSL;

  //Base dos certificados ssl
  const options = {
    key: fs.readFileSync(config.SSL_KEY),
    cert: fs.readFileSync(config.SSL_CERT)
  };

  // Configura o middleware para servir arquivos estáticos
  app.use(express.static(publicPath));

  //Config de rotas para trabalhar localmente com express.static
  //As que não requer verificação passam primeiro
  app.get('/register', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  app.get('/recovery-password/:token', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  //As que precisam de verificação especial recebem seu middleware específico
  app.get('/admin', adminPermissionVerify, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  app.get('/create', editorPermissionVerify, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  //Aqui é onde chama todas as outras rotas que não precisam de verificação especial
  app.get('*', permissionVerify, (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  // Inicie o servidor HTTPS
  https.createServer(options, app).listen(port_ssl, () => {
    console.log(`Servidor HTTPS iniciado em ${host} na porta: ${port_ssl}`);
  });

} else {
  
  //Configs de rotas para autenticação com Nginx
  app.get('/verifica-token-jwt', permissionVerify, (req, res) => {
    res.sendStatus(200); // Token válido
  });

  app.get('/verifica-token-jwt-admin', adminPermissionVerify, (req, res) => {
  res.sendStatus(200); // Token válido
  });

  app.get('/verifica-token-jwt-editor', editorPermissionVerify, (req, res) => {
  res.sendStatus(200); // Token válido
  });
  
  // Inicie o servidor HTTP na porta 3000
  app.listen(port, () => {
    console.log(`Servidor HTTP iniciado em ${host} na porta: ${port}`);
  });
}