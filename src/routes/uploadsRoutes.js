const express = require("express");
const { multerUpload, multerUploadFiles, axiosUploadFiles } = require("../utils/filesUpload.js");
const { createToken } = require('../utils/tinymce-jwt.js');
const router = express.Router();

// Upload com Multer
router.post('/upload_files', multerUpload.single("files"), multerUploadFiles);

// Upload com axios
router.post('/upload', axiosUploadFiles);

//Geração do token para postagem com tinyMCE
router.post('/tinymce-jwt', createToken);

module.exports = router;