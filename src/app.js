const { config } = require('./config/configFile.js');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');

const axios = require('axios');
const fs = require('fs');

// Manipulador de media
const multer = require("multer");
/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads/posts_media');
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    //cb(null, file.fieldname + '-' + uniqueSuffix);
    cb(null, file.originalname);
  },
}); */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/posts_banner')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
});
const upload = multer({ storage });
//const upload = multer({ dest: "./src/uploads/posts_media" });
//const upload = multer({ storage });

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


// Upload com Multer
app.post("/upload_files", upload.single("files"), uploadFiles);

function uploadFiles(req, res) {
    console.log("upload");
    console.log(req.body);
    console.log(req.file);
    res.json({ message: "Successfully uploaded files", data: { 
      'destination': req.file.destination,
      'filename': req.file.filename 
    }});
}

// Upload com Axios
app.post('/upload', async (req, res) => {
  const { imageUrls, imageUris } = req.body;
  console.log("passou aqui");

  // Iterar sobre as URLs das imagens e fazer o download e salvar localmente
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
      //const directory = './src/uploads/posts_media';
      const directory = './public/uploads/posts_media';


      //const ext = path.extname(imageUrls[i]);
      //const filename = path.join(directory, `image_${i}${ext}`);
      const filename = path.join(directory, imageUris[i]);
      fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
    } catch (error) {
      console.error('Erro ao fazer download da imagem:', error);
    }
  }

  res.send('Imagens salvas com sucesso!');
});

// Testando exibição de posts com GET BY ID
app.get('/latest-news', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Testando editores de texto (atual: tinymce)
app.get('/editor', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use('/api', routes);

app.listen(port, ip, () => {
  console.log(`Servidor rodando em http://${ip}:${port}`);
});