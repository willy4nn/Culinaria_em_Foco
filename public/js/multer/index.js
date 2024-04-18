import setFileName from "./fileNameGenerator.js";

function importFile(e) {

// newHtmlString: Conteúdo do post para armazena no banco
// imageUrls: URLs enviadas ao servidor para salvar as imagens
// imageUris: Novos nomes das imagens para servir de referência de acesso
const { newHtmlString, imageUrls, imageUris } = setFileName(e);

console.log("newHtmlString::", newHtmlString);
console.log("imageUrls::", imageUrls);
console.log("imageUris::", imageUris);

axios.post('http://localhost:3000/upload', { imageUrls, imageUris })
  .then(response => {
    console.log("res", response);
  })
  .catch(error => {
    console.error('Erro:', error);
  });

  return newHtmlString;
}

export default importFile;

