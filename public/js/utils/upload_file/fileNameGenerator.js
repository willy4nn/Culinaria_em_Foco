function setFileName(htmlString){
     // Remover "../.." do início de cada string adicionado pelo tinymce, se presente
     htmlString = htmlString.replace(/(\.\.\/)+/g, '/');

    // Expressão regular para encontrar todas as ocorrências de src em tags img e ignorar /uploads/posts_media
    //const pattern = /<img src="(?!\/uploads\/posts_media\/)([^"]+)">/g;
    const pattern = /<img((?:(?!src=["']\/uploads\/posts_media\/).)*?)src=["']((?!\/uploads\/posts_media\/)[^"']+)["'](.*?)\/?>/g;
    // Atualizado para funcioanr com tinymce e capturar os atributos de tamanho.

    // Contador para gerar os ids
    let counter = 1;

    const imageUrls = [];
    const imageUris = [];

    // Função para substituir a ocorrência de src por um id combinado com o nome da imagem
    function replaceSrc(match, attributes, src, rest) {
        // Capturando os atributos width e height, se estiverem presentes
        const widthMatch = rest.match(/width\s*=\s*["']?(\d+|[^"'\s]+)/);
        const heightMatch = rest.match(/height\s*=\s*["']?(\d+|[^"'\s]+)/);

        const widthAttribute = widthMatch ? ` width="${widthMatch[1]}"` : '';
        const heightAttribute = heightMatch ? ` height="${heightMatch[1]}"` : '';

        let newId;
        let ext = '';
        
        // Verificar se a src está no formato de base64 e executa um tratamento diferente
        if (src.startsWith('data:image')) {
            // Extrair a extensão da src
            const extIndex = src.indexOf('/');
            if (extIndex !== -1) {
                ext = src.substring(extIndex + 1, src.indexOf(';'));
            }
            newId = `image_${Date.now()}_${counter}.${ext}`;
        } else {
            // Desfaz a formatação de caracteres especiais em URL no HTML
            const decodedSrc = decodeHTMLUrl(src);

            // Pega o nome da imagem, conteúdo após a ultima barra
            const imageName = decodedSrc.substring(decodedSrc.lastIndexOf('/') + 1);

            // Concatena todas as partes do novo nome
            newId = `image_${Date.now()}_${counter}_${imageName}${ext}`;

            // Tira os excessos após a extensão do nome se houver
            newId = newId.replace(/\?.*/, '');
        }

        // Desfaz a formatação de caracteres especiais em URL no HTML
        imageUrls.push(decodeHTMLUrl(src));
        imageUris.push(newId);

        counter++;

        // Path de armazenamento das imagens
        const folderPath = "/uploads/posts_media/";

        // Retorna o novo nome junto ao path
        return `<img${attributes} src="${folderPath}${newId}"${widthAttribute}${heightAttribute}>`;
        // Ajustada para preservar os atributos de tamanho
    }

    // Substituir todas as ocorrências de src por ids combinados com o nome da imagem
    const newHtmlString = htmlString.replace(pattern, replaceSrc);

    return { newHtmlString, imageUrls, imageUris };
}

function decodeHTMLUrl(url){
    var doc = new DOMParser().parseFromString(url, "text/html");
    return doc.documentElement.textContent;
}

export default setFileName;

