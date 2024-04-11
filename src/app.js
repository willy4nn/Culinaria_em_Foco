const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');

const app = express();
const port = config.PORT;
const ip = config.HOST;

//Middleware pra analisar o corpo das requisições JSON
app.use(express.json());

//Middleware pra lidar com os cookies
app.use(cookieParser());

// Middleware cors para habilitar a política de CORS
app.use(cors({ origin: 'http://localhost' }));

// Middleware para adicionar o cabeçalho X-Frame-Options
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const routes = require('./routes');
app.use('/api', routes);

app.listen(port, ip,() => {
  console.log(`Servidor rodando em http://${ip}:${port}`);
});