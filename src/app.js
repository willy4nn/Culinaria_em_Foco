const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');

const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync(config.SSL_KEY),
    cert: fs.readFileSync(config.SSL_CERT)
};

const app = express();
const port = config.PORT;
const port_ssl = config.PORT_SSL;
const ip = config.HOST;

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

//Middleware Body parser


// Manipulador de media
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      if (req.body.type === 'banner') cb(null, './public/uploads/posts_banner');
      else if (req.body.type === 'photo')cb(null, './public/uploads/profile_photo');
      else throw Error('Tipo de upload inválido (banner | photo)');
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
    }});
}

app.post('/upload', async (req, res) => {
  const { imageUrls, imageUris } = req.body;

  // Iterar sobre as URLs das imagens e fazer o download e salvar localmente
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const response = await fetch(imageUrls[i]);
      const imageData = await response.arrayBuffer();
      
      //const directory = './src/uploads/posts_media';
      const directory = './public/uploads/posts_media';

      //const ext = path.extname(imageUrls[i]);
      //const filename = path.join(directory, `image_${i}${ext}`);
      const filename = path.join(directory, imageUris[i]);
      fs.writeFileSync(filename, Buffer.from(imageData));
    } catch (error) {
      console.error('Erro ao fazer download da imagem:', error);
    }
  }
  res.status(200).json({ message: 'Imagens salvas com sucesso!' });
});

// Middlewares que verificam se usuario está logado e seus derivados cargos
const permissionVerify = require("./middlewares/permissionVerify.js")
const adminPermissionVerify = require("./middlewares/adminPermissionVerify.js")
const editorPermissionVerify = require("./middlewares/editorPermissionVerify.js")

//Base de rotas da API
const routes = require('./routes');
app.use('/api', routes);

//Base de rotas das páginas
//As que não requer verificação passam primeiro
app.get('/register', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/login', (req, res) => {
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


// Middleware de redirecionamento
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

// Inicie o servidor HTTPS
https.createServer(options, app).listen(config.PORT_SSL, () => {
  console.log(`Servidor HTTPS iniciado em ${ip} na porta: ${port_ssl}`);
});

// Inicie o servidor HTTP na porta 80
app.listen(config.PORT, () => {
  console.log(`Servidor HTTP iniciado em ${ip} na porta: ${port}`);
});