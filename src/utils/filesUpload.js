const multer = require("multer");
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Define o caminho absoluto para a pasta "public"
const publicPath = path.join(__dirname, '../../public');

// Função utilitária para criar diretórios recursivamente se não existirem
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

//Upload de imagens com o Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      let uploadPath;
      switch (req.body.type) {
        case 'banner':
          uploadPath = path.join(publicPath, 'uploads/posts_banner');
          break;
        case 'photo':
          uploadPath = path.join(publicPath, 'uploads/profile_photo');
          break;
        default:
          throw new Error('Tipo de upload inválido (banner | photo)');
      }

      ensureDirectoryExists(uploadPath);

      cb(null, uploadPath);
    } catch (error) {
      console.error('Erro :', error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const multerUpload = multer({ storage });

function multerUploadFiles(req, res) {
  res.json({ message: "Successfully uploaded files", data: { 
    'destination': req.file.destination,
    'filename': req.file.filename 
  }});
}

//Upload de imagens com o axios
async function axiosUploadFiles(req, res) {
  const { imageUrls, imageUris } = req.body;
  const downloadPromises = [];

  // Iterar sobre as URLs das imagens e fazer o download e salvar localmente
  for (let i = 0; i < imageUrls.length; i++) {
    downloadPromises.push(
      new Promise(async (resolve, reject) => {
        try {
          const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
          const directory = path.join(publicPath, 'uploads/posts_media');
          ensureDirectoryExists(directory);
          const filename = path.join(directory, imageUris[i]);
          fs.writeFileSync(filename, Buffer.from(response.data, 'binary'));
          resolve();
        } catch (error) {
          console.error("Imagem não foi enviada!", error);
          reject(error);
        }
      })
    );
  }

  try {
    await Promise.all(downloadPromises);
    res.json({ message: "Imagens enviadas com Sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar as Imagens" });
  }
}

module.exports = { multerUploadFiles, multerUpload, axiosUploadFiles };