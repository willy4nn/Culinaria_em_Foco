import createCustomEvent from '../eventModule.js';
import { importHTMLContentFiles, importHTMLContentFilesWithFetch, importLocalFile } from '../multer/index.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função que retorna a página de login
export default function create() {
  const createPostContentHTML = `

  <!-- ########## MAIN ########## -->
  <main class="main main-create-post"> 
    <!-- Título da página -->
    <h1 class="primary-heading">Create Post</h1>

    <!-- Formulário para criar post -->
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
        <!-- Editor de texto -->
        <div id="editor-container">
          <!-- Editor será adicionado aqui via js -->
        </div>
      </div>

      <!-- Botões para salvar ou postar o conteúdo -->
      <div class="buttons">
        <button class="button button-line" id="button-save">Save</button>
        <button class="button button-fill" id="button-post">Post</button>
      </div>
    </form>
  </main>
  `;

  const createPostElement = document.createElement('div');
  createPostElement.classList.add('create-post-container');
  createPostElement.innerHTML = createPostContentHTML;

  //Adiciona os elementos footer e header
  const main = createPostElement.querySelector("main") 
  createPostElement.insertBefore(header(), main)
  createPostElement.append(footer())
  
  //Modal de erro
  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

  // Novo editor
  //const textareaForm = createPostElement.querySelector("#textarea-form");
  const editorContainer = createPostElement.querySelector("#editor-container");

  const cdnTinymce = document.createElement('script');
  cdnTinymce.src = 'https://cdn.tiny.cloud/1/uwf3bfwp12rlz75gub5bslngqa8e0hdk16ddbzgp6pmc9myb/tinymce/7/tinymce.min.js';
  createPostElement.appendChild(cdnTinymce);

  const textarea = document.createElement('textarea');
  textarea.id = 'mytextarea';
  textarea.style.display = 'none';
  editorContainer.appendChild(textarea);

  const configTinymce = document.createElement('script');
  setTimeout(() => {
    try {
      //const configTinymce = document.createElement('script');
      configTinymce.src = '/js/tinymce.js';
      createPostElement.appendChild(configTinymce);
      textarea.style.display = 'flex';
    } catch (error) {
      showPopup('O editor não conseguiu carregar corretamente, por favor atualize a página', 'Erro!', false);
    }
    
  }, 1000);
  // end Novo Editor




  const titleInput = createPostElement.querySelector('#title');
  const categoryInputs = createPostElement.querySelectorAll('input[name="category"]');

  const bannerInput = createPostElement.querySelector('#banner');
  const bannerPreview = createPostElement.querySelector('#banner-preview');
  bannerPreview.src = '/assets/images/default_image_banner.png';

  const buttonPost = createPostElement.querySelector('#button-post');
  const buttonSave = createPostElement.querySelector('#button-save');

  // Crie um elemento script
  //const axiosScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  //axiosScriptElement.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';

  // Adicione o elemento script ao final do corpo do documento
  //createElement.appendChild(axiosScriptElement);



  // Carrega os dados do usuário logado
  // Todas as requisições que dependam do ID do usuário ou do Editor serão feitas aqui dentro
  // Apenas teste utilizei uma abordagem diferente do getPost.js para efetuar um carregamento paralelo
  Promise.all([getLogin(), new Promise((resolve, reject) => {
    configTinymce.addEventListener('load', resolve);
  })])
  .then(([userData, _]) => {
    // _ é uma convensão de nomenclatura para uma promisse ignorada (não será utilizada)
      console.log("Carregou:", userData);

      // Carrega o editor de texto
      /* const editor = new Quill('#editor', {
          modules: { toolbar: '#toolbar' },
          theme: 'snow',
      }); */

      buttonPost.addEventListener('click', (event) => {
        event.preventDefault();

        // Trata o conteúdo princial da postagem e salva as imagens no storage
        //const content = importHTMLContentFilesWithFetch(editor.root.innerHTML);
        const content = tinymce.activeEditor.getContent("myTextarea");

        // Efetua a postagem
        submitPost(true, content, userData.id);
      });

      buttonSave.addEventListener('click', (event) => {
        event.preventDefault();

        // Trata o conteúdo princial da postagem e salva as imagens no storage
        //const content = importHTMLContentFiles(editor.root.innerHTML);
        const content = tinymce.activeEditor.getContent("myTextarea");

        // Salva a postagem como rascunho
        submitPost(false, content, userData.id);
      });
  })
  .catch(error => {
      showPopup(error)
      console.error("Erro:", error);
  });
  
 
  // Se clicar e não selecionar nenhum arquivo, o anterior é perdido.
  bannerInput.addEventListener('click', () => { 
    console.log("entrou aqui;");
    bannerPreview.src = '/assets/images/default_image_banner.png';
  
  });
  bannerInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      bannerPreview.src = imageUrl;
    }
  });

  async function submitPost(posted_draft, editorContent, users_id) {
    const title = titleInput.value.toString();
    let category;
    categoryInputs.forEach((input) => {
      if (input.checked) {
        category = input.value;
      }
    });

    if (!bannerInput.files[0]){
      showPopup("Insira uma imagem para a Postagem")
      return
    }

    if (title == ""){
      showPopup("Insira um Título para a Postagem")
      return
    }

    if(!category){
      showPopup("Marque uma Categoria para a Postagem")
      return
    }
    
    category = category ? category.toLowerCase() : ''; // Fixando a categoria vazia se não houver seleção
    const content = editorContent.toString();
    // Se tiver file armazena a imagem no back e retorna a uri, se não retorna vazio
    const banner = await importLocalFile(bannerInput.files[0], 'banner');

    console.log('bn', bannerInput);
    console.log('bn', bannerInput.files);

    const data = { title, category, content, banner, posted_draft };
    console.log(data);

    fetch(`/api/posts/`, {
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
        setTimeout(() => {
          window.dispatchEvent(createCustomEvent('/create'));
        }, 3000); 
        showPopup("Post efetuado com sucesso!", "Sucesso!", true)
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        showPopup(error)
        console.error('Erro:', error);
      });
  }

  return createPostElement;
}

async function getLogin() {
  return fetch('/api/login/user')
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      console.log("get user :", data);
      return data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}
