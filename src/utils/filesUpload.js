const multer = require("multer");
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Define o caminho absoluto para a pasta "public"
const publicPath = path.join(__dirname, '../public');

//Upload de imagens com o Multer
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

const multerUpload = multer({ storage });

function multerUploadFiles(req, res) {
    res.json({ message: "Successfully uploaded files", data: { 
      'destination': req.file.destination,
      'filename': req.file.filename 
    }}
  )};

//Upload de imagens com o axios
async function axiosUploadFiles(req, res) {
    const { imageUrls, imageUris } = req.body;
  
    // Iterar sobre as URLs das imagens e fazer o download e salvar localmente
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
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
  }

module.exports = { multerUploadFiles, multerUpload, axiosUploadFiles };