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
    console.log("aqui:", req.body.type);
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

// Middleware que verifica se usuario está logado
const permissionVerify = require("./middlewares/permissionVerify.js")

const routes = require('./routes');

// Rota para lidar com todas as outras solicitações
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/home', permissionVerify, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


app.get('/post', (req, res) => {
  console.log("1");
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/post/:id', (req, res) => {
  console.log("3");
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/post/edit/:id', (req, res) => {
  console.log("2");
  res.sendFile(path.join(publicPath, 'index.html'));
});


/* // Rota para servir arquivos CSS
app.get('/css/style.css', (req, res) => {
  // Define o tipo MIME como text/css
  res.setHeader('Content-Type', 'text/css');
  // Envia o arquivo CSS
  res.sendFile(path.join(publicPath, 'css', 'style.css'));
});
 */

// Upload com Multer
app.post("/upload_files", upload.single("files"), uploadFiles);

function uploadFiles(req, res) {
    console.log("upload");
    console.log(req.body);
    console.log(req.file);
    console.log(req.file.destination);
    console.log(req.file.filename);
    console.log(req.file.filename);
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

  res.status(200).json({ message: 'Imagens salvas com sucesso!' });
});

// Testando exibição de posts com GET BY ID
app.get('/latest-news', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Testando editores de texto (atual: tinymce)
app.get('/editor', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/favorite', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});


app.use('/api', routes);

app.listen(port, ip, () => {
  console.log(`Servidor rodando em http://${ip}:${port}`);
});