const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
const axios = require('axios');

const fs = require('fs');

const app = express();
const port = config.PORT;
const host = config.HOST;

//Essa variável determina o ambiente em que o sistema está rodanto // development | production
const environment = config.NODE_ENV;

// Define o caminho absoluto para a pasta "public"
const publicPath = path.join(__dirname, '../public');

// Middleware para analisar o corpo das requisições JSON
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
//app.use(express.json({verify: (req, res, buf) => { req.rawBody = buf.toString()},limit: '50mb'}));

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

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      let uploadPath;
      if (req.body.type === 'banner') 
        uploadPath = './public/uploads/posts_banner';
      else if (req.body.type === 'photo')
        uploadPath = './public/uploads/profile_photo';
      else 
        throw Error('Tipo de upload inválido (banner | photo)');
      
      // Verificar se o diretório existe, caso contrário, criá-lo
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);

    } catch (error) {
      console.error('Erro :', error)
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});
const upload = multer({ storage });

// Upload com Multer
app.post("/upload_files", upload.single("files"), uploadFiles);

function uploadFiles(req, res) {
    res.json({ message: "Successfully uploaded files", data: { 
      'destination': req.file.destination,
      'filename': req.file.filename 
    }}
  )};

// Upload com axios
app.post('/upload', async (req, res) => {
  const { imageUrls, imageUris } = req.body;

  // Iterar sobre as URLs das imagens e fazer o download e salvar localmente
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
      console.log("Imagem enviada com sucesso!", response)
      const directory = './public/uploads/posts_media';

      // Verificar se o diretório existe, caso contrário, criá-lo
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      const filename = path.join(directory, imageUris[i]);
      fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
    } catch (error) {
      console.error("Imagem não foi enviada!", error)
    res.sendFile(path.join(publicPath, 'index.html'));
  }}
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

  app.get('/editor', editorPermissionVerify, (req, res) => {
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