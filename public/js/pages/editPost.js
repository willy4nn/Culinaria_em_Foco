import createCustomEvent from '../eventModule.js';
import { importHTMLContentFiles, importHTMLContentFilesWithFetch, importLocalFile } from '../multer/index.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
// import menuToggle from './elements/menuToggle.js';

// Exporta a função que retorna a página de login
export default function editPost(postId) {

  const editPostContentHTML = `
  <!-- ########## MAIN ########## -->
  <main class="main main-create-post"> 
    <!-- Título da página -->
    <h1 class="primary-heading">Edit Post</h1>
  
    <!-- Formulário para editar post -->
    <form class="editor-container">
      <!-- Campo para inserir o título do post -->
      <div class="input-container">
        <input class="title-input tertiary-heading" id="title" type="text" name="title" placeholder="Untitled" />
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
        <img id="banner-preview" class="create-post-banner">
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
        <button class="button button-line" id="button-discard">Discard</button>
        <button class="button button-fill" id="button-save-and-post">Save and Post</button>
      </div>
    </form>
  </main>
  `;

  const editPostElement = document.createElement('div');
  editPostElement.classList.add('edit-post-element');
  editPostElement.innerHTML = editPostContentHTML;

  //Adiciona os elementos footer e header
  const main = editPostElement.querySelector("main") 
  editPostElement.insertBefore(header(), main)
  editPostElement.append(footer())

  const titleInput = editPostElement.querySelector('#title');
  const categoryInputs = editPostElement.querySelectorAll(
    'input[name="category"]'
  );
  const bannerInput = editPostElement.querySelector('#banner');
  const imageInput = editPostElement.querySelector('#image');
  const bannerPreview = editPostElement.querySelector('#banner-preview');

  const buttonDiscard = editPostElement.querySelector('#button-discard');
  const buttonSaveAndPost = editPostElement.querySelector('#button-save-and-post');

  // Crie um elemento script
  const quillScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  quillScriptElement.src = 'https://cdn.quilljs.com/1.0.0/quill.js';
  quillScriptElement.id = 'quill-script';

  // Adicione o elemento script ao final do corpo do documento
  editPostElement.appendChild(quillScriptElement);

  // Carrega o editor de texto
  quillScriptElement.addEventListener('load', function() {
    var editor = new Quill('#editor', {
      modules: { toolbar: '#toolbar' },
      theme: 'snow'
    });

    getPostById(postId)
    .then(post => {
      console.log("Aqui:", post)
      titleInput.value = post.title;
      //categoryInputs.value = post.category;
      document.querySelector(`#${post.category}`).checked = true;
      editor.root.innerHTML = post.content;
      imageInput.value = post.image;
      bannerPreview.src = post.banner;

      const resetChanges = [post.title, post.category, post.content, post.banner];

      // Se clicar e não selecionar nenhum arquivo, o anterior é perdido e o seletor fica vazio
      // Isso implica que usuário não quer alterar o banner, então retorna a imagem original.
      bannerInput.addEventListener('click', () => { bannerPreview.src = '/assets/images/default_image_banner.png'; });
   
      buttonDiscard.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Volta todos os dados orignais do post
        [ titleInput.value, categoryInputs.value, editor.root.innerHTML, bannerPreview.src ] = resetChanges;
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
    let category;
    categoryInputs.forEach((input) => {
      if (input.checked) {
        category = input.value.toString().toLowerCase();
      }
    });
    const content = editorContent.toString();
    // Armazena a imagem no back e retorna a uri
    
    const banner = bannerURI;
    const image = imageInput.value.toString();
    const posted_draft = true;

    const data = { title, category, content, banner, image, posted_draft };
    console.log(data);

    fetch(`/api/posts/` + postId, {
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
      return await importLocalFile(newBannerFile, 'banner');
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
  return fetch('/api/posts/' + id)
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
