import createCustomEvent from '../eventModule.js';
import { importHTMLContentFiles, importHTMLContentFilesWithFetch, importLocalFile } from '../multer/index.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import menuToggle from './elements/menuToggle.js';

// Exporta a função que retorna a página de login
export default function editPost(postId) {

  const editPostContentHTML = `
    <main class=""> 

      <form class="form">

        <div class="input-container">
          <input id="title" type="text" name="title" placeholder="Title" />
        </div>  
        <div class="input-container">
          <select name="category" id="category">
            <option selected disabled value="interviews">Select</option>
            <option value="interviews">Interviews</option>
            <option value="reviews">Reviews</option>
            <option value="stories">Stories</option>
            <option value="tips">Tips</option>
            <option value="trends">Trends</option>
          </select>
        </div>

        <div class="input-container">
        
          <div id="toolbar">
            <span class="ql-formats">
              <select class="ql-font"></select>
              <select class="ql-size"></select>
            </span>
            <span class="ql-formats">
              <button class="ql-bold"></button>
              <button class="ql-italic"></button>
              <button class="ql-underline"></button>
              <button class="ql-strike"></button>
            </span>
            <span class="ql-formats">
              <select class="ql-color"></select>
              <select class="ql-background"></select>
            </span>
            <span class="ql-formats">
              <button class="ql-script" value="sub"></button>
              <button class="ql-script" value="super"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-header" value="1"></button>
              <button class="ql-header" value="2"></button>
              <button class="ql-blockquote"></button>
              <button class="ql-code-block"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-list" value="ordered"></button>
              <button class="ql-list" value="bullet"></button>
              <button class="ql-indent" value="-1"></button>
              <button class="ql-indent" value="+1"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-direction" value="rtl"></button>
              <select class="ql-align"></select>
            </span>
            <span class="ql-formats">
              <button class="ql-link"></button>
              <button class="ql-image"></button>
              <button class="ql-video"></button>
              <button class="ql-formula"></button>
            </span>
            <span class="ql-formats">
              <button class="ql-clean"></button>
            </span>
          </div>
            
          <!-- Create the editor container -->
          <div id="editor">
            <p>Hello World!</p>
          </div>
        </div>

        <br>
        <br>
        <br>
        <div id="banner-container" class="input-container">
          <label for='files'>Select banner</label>
          <input id='banner' type="file" name="files">
          <img id='banner-preview'>
        </div>
        <div class="input-container">
          <input id="image" type="text" name="image" placeholder="Image Temporário"/>
        </div>
        <button id="button-discard">Discard</button>
        <button id="button-save-and-post">Save and Post</button>
      </form>

  `;

  const editPostElement = document.createElement('div');
  editPostElement.classList.add('edit-post-element');
  editPostElement.innerHTML = editPostContentHTML;

  //Adiciona os elementos footer e header
  const main = editPostElement.querySelector("main") 
  editPostElement.insertBefore(header(), main)
  editPostElement.append(footer())
  editPostElement.append(menuToggle())

  const titleInput = editPostElement.querySelector('#title');
  const categoryInput = editPostElement.querySelector('#category');
  const bannerInput = editPostElement.querySelector('#banner');
  const bannerPreview = editPostElement.querySelector('#banner-preview');
  const imageInput = editPostElement.querySelector('#image');

  const buttonDiscard = editPostElement.querySelector('#button-discard');
  const buttonSaveAndPost = editPostElement.querySelector('#button-save-and-post');

  // Crie um elemento script
  const axiosScriptElement = document.createElement('script');
  const quillScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  //axiosScriptElement.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
  quillScriptElement.src = 'https://cdn.quilljs.com/1.0.0/quill.js';
  quillScriptElement.id = 'quill-script';

  // Adicione o elemento script ao final do corpo do documento
  //editorElement.appendChild(axiosScriptElement);
  editPostElement.appendChild(quillScriptElement);

  // Carrega o editor de texto
  quillScriptElement.addEventListener('load', function() {
    var editor = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow'
    });

    getPostById(postId)
    .then(post => {

      titleInput.value = post.title;
      categoryInput.value = post.category;
      editor.root.innerHTML = post.content;
      imageInput.value = post.image;
      bannerPreview.src = post.banner;

      const resetChanges = [post.title, post.category, post.content, post.banner];
   
      buttonDiscard.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Volta todos os dados orignais do post
        [ titleInput.value, categoryInput.value, editor.root.innerHTML, bannerPreview.src ] = resetChanges;
        bannerInput.value = '';

        if (bannerInput.files[0]) console.log("tem banner", bannerInput.files[0]);
      });
  
      buttonSaveAndPost.addEventListener('click', async (event) => {
        event.preventDefault();
  
        // Faz o upload do novo banner ou mantem o mesmo
        const banner = await bannerChange(bannerInput.files[0], post.banner);

        // Trata o conteúdo princial da postagem e salva as imagens no storage
        const content = importHTMLContentFilesWithFetch(editor.root.innerHTML);

        // Salva a postagem como rascunho
        updatePost(content, banner);
      });

    })

    
 
  });

  async function updatePost(editorContent, bannerURI) {
    const title = titleInput.value.toString();
    const category = categoryInput.value.toString().toLowerCase();
    const content = editorContent.toString();
    // Armazena a imagem no back e retorna a uri
    
    const banner = bannerURI;
    const image = imageInput.value.toString();
    const posted_draft = true;

    const data = { title, category, content, banner, image, posted_draft };
    console.log(data);

    fetch(`http://localhost:3000/api/posts/` + postId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha efetuar a postagem');
        }
        window.dispatchEvent(createCustomEvent('/post/' + postId));
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });

  }

  async function bannerChange(newBannerFile, oldBannerURI) {
    if (newBannerFile) {
      return await importLocalFile(newBannerFile);
    } else {
      return oldBannerURI
    }
  }
  // Se clicar e não selecionar nenhum arquivo, o anterior é perdido.
  bannerInput.addEventListener('click', () => { 
    console.log("entrou aqui;");
    bannerPreview.src = '/assets/images/default_image_banner.png';
  
  });
  bannerInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      bannerPreview.src = imageUrl;
      console.log("passou aqui");
    }
  });


  return editPostElement;
}


async function getPostById(id) {
  console.log("aqui o id", id);
  return fetch('http://localhost:3000/api/posts/' + id)
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      console.log("get post :", data);
      return data.data[0];
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}
