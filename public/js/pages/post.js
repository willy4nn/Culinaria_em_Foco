// post.js
import createCustomEvent from '../eventModule.js';

// Exporta a função que retorna a página de login
export default function createPost() {
  // HTML do elemento de login
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
    <main class="login-main"> 
      <h1 class="title">Login</h1>
      <div class="box-login">
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
            <input id="banner" type="text" name="banner" placeholder="Banner Temporário"/>
          </div>
          <div class="input-container">
            <input id="image" type="text" name="image" placeholder="Image Temporário"/>
          </div>
          <button id="button-save">Save</button>
          <button id="button-post">Post</button>
        </form>
      </div>

      <div id="container-print"></div>

    </main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria o elemento de login
  const createPostElement = document.createElement('div');
  createPostElement.classList.add('create-post-element');
  createPostElement.innerHTML = createPostContentHTML;

  const titleInput = createPostElement.querySelector('#title');
  const categoryInput = createPostElement.querySelector('#category');
  const contentInput = createPostElement.querySelector('#content');
  const bannerInput = createPostElement.querySelector('#banner');
  const imageInput = createPostElement.querySelector('#image');

  const buttonPost = createPostElement.querySelector('#button-post');
  const buttonSave = createPostElement.querySelector('#button-save');
  const containerPrint = createPostElement.querySelector('#container-print');

// Crie um elemento script
  const quillScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  quillScriptElement.src = 'https://cdn.quilljs.com/1.0.0/quill.js';
  quillScriptElement.id = 'quill-script';

  // Adicione o elemento script ao final do corpo do documento
  createPostElement.appendChild(quillScriptElement);

  quillScriptElement.addEventListener('load', function() {
    console.log('Script carregado com sucesso!');
    var editor = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow'
    });

    buttonPost.addEventListener('click', (event) => {
      // Esta linha evita o comportamento padrão do botão, que é enviar o formulário
      event.preventDefault();

      // Efetua a postagem
      submitPost(true, editor.root.innerHTML);
      //containerPrint.innerHTML = editor.root.innerHTML;
    });

    buttonSave.addEventListener('click', (event) => {
      // Esta linha evita o comportamento padrão do botão, que é enviar o formulário
      event.preventDefault();

      // Salva a postagem como rascunho
      submitPost(false, editor.root.innerHTML);

      console.log(editor.getText());
      console.log("----");
      console.log(editor.getContents());
      console.log("----");
      console.log(editor.root.innerHTML);
    });

  });

  function submitPost(posted_draft, editorContent) {
    const title = titleInput.value.toString();
    const category = categoryInput.value.toString().toLowerCase();
    const content = editorContent.toString();
    const banner = bannerInput.value.toString();
    const image = imageInput.value.toString();

    const data = { title, category, content, banner, image, posted_draft };
    console.log(data);
   
    // Esta linha envia uma requisição POST para o servidor com o nome de usuário e senha no corpo da requisição
    fetch(`http://localhost:3000/api/posts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Esta linha verifica se a resposta do servidor é bem-sucedida
        if (!response.ok) {
          throw new Error('Falha efetuar a postagem');
        }
        // Esta linha retorna os dados da resposta em formato JSON
        window.dispatchEvent(createCustomEvent('/post'));
        return response.json();
      })
      .then((data) => {
        // Esta linha registra os dados recebidos do servidor no console (você pode substituir isso por sua própria lógica para lidar com a resposta)
        console.log(data);
      })
      .catch((error) => {
        // Esta linha captura qualquer erro que ocorra durante o processo de login
        console.error('Erro:', error);
      });

  }

  // Retorna o elemento de login
  return createPostElement;
}
