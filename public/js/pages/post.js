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
    <!-- ########## MAIN ########## -->
<main class="main main-create-post"> 
  <!-- Título da página -->
  <h1 class="primary-heading">Create Post</h1>

  <!-- Formulário para criar post -->
  <form class="editor-container">
    <!-- Campo para inserir o título do post -->
    <div class="input-container">
      <input class="title-input secondary-heading" id="title" type="text" name="title" placeholder="Untitled" />
    </div>  
    <!-- Dropdown para selecionar a categoria do post -->
    <div class="select-category">
      <input type="radio" id="interviews" name="category" value="interviews">
      <label class="checkbox" for="interviews">Interviews</label><br>

      <input type="radio" id="reviews" name="category" value="reviews">
      <label class="checkbox" for="reviews">Reviews</label><br>

      <input type="radio" id="stories" name="category" value="stories">
      <label class="checkbox" for="stories">Stories</label><br>

      <input type="radio" id="tips" name="category" value="tips">
      <label class="checkbox" for="tips">Tips</label><br>

      <input type="radio" id="trends" name="category" value="trends">
      <label class="checkbox" for="trends">Trends</label><br>
    </div>

    <!-- Upload de banner -->
    <div class="select-banner">
      <label class="paragraph-medium" for='files'>Select Banner</label>
      <input class="paragraph-medium" id='banner' type="file" name="files">
    </div>

    <div class="editor input-container">
      <!-- Barra de ferramentas do editor de texto -->
      <div id="toolbar">
        <!-- Formatação de texto -->
        <span class="ql-formats">
          <select class="ql-font"></select>
          <select class="ql-size"></select>
        </span>
        <!-- Estilos de texto -->
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
        <!-- Cores de texto -->
        <span class="ql-formats">
          <select class="ql-color"></select>
          <select class="ql-background"></select>
        </span>
        <!-- Script e cabeçalhos -->
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
        <!-- Listas -->
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <button class="ql-indent" value="-1"></button>
          <button class="ql-indent" value="+1"></button>
        </span>
        <!-- Alinhamento e direção do texto -->
        <span class="ql-formats">
          <button class="ql-direction" value="rtl"></button>
          <select class="ql-align"></select>
        </span>
        <!-- Links, imagens, vídeos e fórmulas -->
        <span class="ql-formats">
          <button class="ql-link"></button>
          <button class="ql-image"></button>
          <button class="ql-video"></button>
          <button class="ql-formula"></button>
        </span>
        <!-- Limpar formatação -->
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </div>
        
      <!-- Editor de texto -->
      <div id="editor">
        <p>Hello World!</p>
      </div>
    </div>

    <!-- Campo para inserir URL da imagem temporária -->
    <div class="input-container">
      <input id="image" type="text" name="image" placeholder="Image Temporário"/>
    </div>
    <!-- Botões para salvar ou postar o conteúdo -->
    <div class="buttons">
      <button class="button button-line" id="button-save">Save</button>
      <button class="button button-fill" id="button-post">Post</button>
    </div>
  </form>
</main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  const createPostElement = document.createElement('div');
  createPostElement.classList.add('create-post-container');
  createPostElement.innerHTML = createPostContentHTML;

  const titleInput = createPostElement.querySelector('#title');
  const categoryInputs = createPostElement.querySelectorAll(
    'input[name="category"]'
  );
  const bannerInput = createPostElement.querySelector('#banner');
  const imageInput = createPostElement.querySelector('#image');

  const buttonPost = createPostElement.querySelector('#button-post');
  const buttonSave = createPostElement.querySelector('#button-save');

  // Crie um elemento script
  const axiosScriptElement = document.createElement('script');
  const quillScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  axiosScriptElement.src =
    'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
  quillScriptElement.src = 'https://cdn.quilljs.com/1.0.0/quill.js';
  quillScriptElement.id = 'quill-script';

  // Adicione o elemento script ao final do corpo do documento
  createPostElement.appendChild(axiosScriptElement);
  createPostElement.appendChild(quillScriptElement);

  // Carrega o editor de texto
  quillScriptElement.addEventListener('load', function () {
    var editor = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow',
    });

    buttonPost.addEventListener('click', (event) => {
      event.preventDefault();

      // Trata o conteúdo princial da postagem e salva as imagens no storage
      const content = importHTMLContentFiles(editor.root.innerHTML);

      // Efetua a postagem
      submitPost(true, content);
    });

    buttonSave.addEventListener('click', (event) => {
      event.preventDefault();

      // Trata o conteúdo princial da postagem e salva as imagens no storage
      const content = importHTMLContentFiles(editor.root.innerHTML);

      // Salva a postagem como rascunho
      submitPost(false, content);
    });
  });

  async function submitPost(posted_draft, editorContent) {
    const title = titleInput.value.toString();
    let category;
    categoryInputs.forEach((input) => {
      if (input.checked) {
        category = input.value;
      }
    });
    category = category ? category.toLowerCase() : ''; // Fixando a categoria vazia se não houver seleção
    const content = editorContent.toString();
    // Armazena a imagem no back e retorna a uri
    const banner = await importLocalFile(bannerInput.files[0]);
    const image = imageInput.value.toString();

    console.log('bn', bannerInput);
    console.log('bn', bannerInput.files);

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
