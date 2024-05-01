const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const axios = require('axios');
const fs = require('fs');

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

// Upload com Multer
app.post("/upload_files", upload.single("files"), uploadFiles);

function uploadFiles(req, res) {
    res.json({ message: "Successfully uploaded files", data: { 
      'destination': req.file.destination,
      'filename': req.file.filename 
    }});
}

// Upload com Axios
app.post('/upload', async (req, res) => {
  const { imageUrls, imageUris } = req.body;

  // Iterar sobre as URLs das imagens e fazer o download e salvar localmente
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
      const directory = './public/uploads/posts_media';

      const filename = path.join(directory, imageUris[i]);
      fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
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

app.listen(port, ip, () => {
  console.log(`Servidor rodando em http://${ip}:${port}`);
});