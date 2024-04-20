import createCustomEvent from '../eventModule.js';
import { importHTMLContentFiles, importLocalFile } from '../multer/index.js';

// Exporta a função que retorna a página de login
export default function createPost() {
  
  const createPostContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
        <span>Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-fill">Sign Up</a>
      </div>
    </header>
    <main class=""> 
      <h1 class="title">Create Post</h1>
      <div class="">
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


          <div class="input-container">
            <label for='files'>Select banner</label>
            <input id='banner' type="file" name="files">
          </div>
          <div class="input-container">
            <input id="image" type="text" name="image" placeholder="Image Temporário"/>
          </div>
          <button id="button-save">Save</button>
          <button id="button-post">Post</button>
        </form>
      </div>

    </main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  const createPostElement = document.createElement('div');
  createPostElement.classList.add('create-post-element');
  createPostElement.innerHTML = createPostContentHTML;

  const titleInput = createPostElement.querySelector('#title');
  const categoryInput = createPostElement.querySelector('#category');
  const bannerInput = createPostElement.querySelector('#banner');
  const imageInput = createPostElement.querySelector('#image');

  const buttonPost = createPostElement.querySelector('#button-post');
  const buttonSave = createPostElement.querySelector('#button-save');

  // Crie um elemento script
  const axiosScriptElement = document.createElement('script');
  const quillScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  axiosScriptElement.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
  quillScriptElement.src = 'https://cdn.quilljs.com/1.0.0/quill.js';
  quillScriptElement.id = 'quill-script';

  // Adicione o elemento script ao final do corpo do documento
  createPostElement.appendChild(axiosScriptElement);
  createPostElement.appendChild(quillScriptElement);

  // Carrega o editor de texto
  quillScriptElement.addEventListener('load', function() {
    var editor = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow'
    });

    buttonPost.addEventListener('click', (event) => {
      event.preventDefault();

      // Trata o conteúdo princial da postagem e salva as imagens no storage
      const content = importHTMLContentFiles(editor.root.innerHTML)

      // Efetua a postagem
      submitPost(true, content);
    });

    buttonSave.addEventListener('click', (event) => {
      event.preventDefault();

      // Trata o conteúdo princial da postagem e salva as imagens no storage
      const content = importHTMLContentFiles(editor.root.innerHTML)

      // Salva a postagem como rascunho
      submitPost(false, content);
    });

  });

  async function submitPost(posted_draft, editorContent) {
    const title = titleInput.value.toString();
    const category = categoryInput.value.toString().toLowerCase();
    const content = editorContent.toString();
    // Armazena a imagem no back e retorna a uri
    const banner = await importLocalFile(bannerInput.files[0])
    const image = imageInput.value.toString();

    console.log("bn", bannerInput);
    console.log("bn", bannerInput.files);

    const data = { title, category, content, banner, image, posted_draft };
    console.log(data);

    fetch(`http://localhost:3000/api/posts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha efetuar a postagem');
        }
        window.dispatchEvent(createCustomEvent('/post'));
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });

  }

  return createPostElement;
}
