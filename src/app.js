const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = config.PORT;
const ip = config.HOST;

// Define o caminho absoluto para a pasta "public"
const publicPath = path.join(__dirname, '../public');

// Middleware para analisar o corpo das requisições JSON
app.use(express.json());

// Configura o middleware para servir arquivos estáticos
app.use(express.static(publicPath));

// Middleware para lidar com os cookies
app.use(cookieParser());

// Middleware cors para habilitar a política de CORS
app.use(cors({ origin: 'http://localhost' }));

// Middleware para adicionar o cabeçalho X-Frame-Options
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const routes = require('./routes');

// Rota para lidar com todas as outras solicitações
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


app.get('/register', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/post', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use('/api', routes);

app.listen(port, ip, () => {
  console.log(`Servidor rodando em http://${ip}:${port}`);
});