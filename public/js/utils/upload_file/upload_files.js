import setFileName from "./fileNameGenerator.js";

function importHTMLContentFiles(htmlContent) {

// newHtmlString: Conteúdo do post para armazena no banco
// imageUrls: URLs enviadas ao servidor para salvar as imagens
// imageUris: Novos nomes das imagens para servir de referência de acesso
const { newHtmlString, imageUrls, imageUris } = setFileName(htmlContent);

axios.post('/api/uploads/upload', { imageUrls, imageUris })
  .then(response => {
    console.log("res", response);
  })
  .catch(error => {
    console.error('Erro:', error);
  });

  return newHtmlString;
}

async function importLocalFile(file, type) {

  //Return "" usado no editPost caso o usuário não altere o banner
  if (!file) return "";

  const formData = new FormData();
  formData.append('type', type);
  formData.append('files', file);


  return fetch("/api/uploads/upload_files", {
      method: 'POST',
      body: formData,
      headers: {
        //"Content-Type": "multipart/form-data"
      },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Um erro ocorreu ao importar o arquivo local");
    }
    return response.json();
  })
  .then((data) => {
    console.log("multer res", data);
    const uri = `/uploads/posts_banner/${data.data.filename}`;
    return uri;
  })
  .catch((error) => ("Error:", error));
}

function importFileURL(url) {

  // newHtmlString: Conteúdo do post para armazena no banco
  // imageUrls: URLs enviadas ao servidor para salvar as imagens
  // imageUris: Novos nomes das imagens para servir de referência de acesso
  const { newHtmlString, imageUrls, imageUris } = setFileName(url);
  
  console.log("newHtmlString::", newHtmlString);
  console.log("imageUrls::", imageUrls);
  console.log("imageUris::", imageUris);
  
  axios.post('/api/uploads/upload', { imageUrls, imageUris })
    .then(response => {
      console.log("res", response);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
  
    return newHtmlString;
}

function importHTMLContentFilesWithFetch(htmlContent) {

  // newHtmlString: Conteúdo do post para armazena no banco
  // imageUrls: URLs enviadas ao servidor para salvar as imagens
  // imageUris: Novos nomes das imagens para servir de referência de acesso
  const { newHtmlString, imageUrls, imageUris } = setFileName(htmlContent);
  
  console.log("newHtmlString::", newHtmlString);
  console.log("imageUrls::", imageUrls);
  console.log("imageUris::", imageUris);
  
  const data =  { imageUrls, imageUris };

  fetch(`/api/uploads/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Falha fazer upload de arquivos');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Erro:', error);
  });
  
  return newHtmlString;
}

export { importHTMLContentFiles, importLocalFile, importHTMLContentFilesWithFetch };

