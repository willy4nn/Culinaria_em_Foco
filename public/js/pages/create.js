import createCustomEvent from '../eventModule.js';
import { importHTMLContentFiles, importHTMLContentFilesWithFetch, importLocalFile } from '../utils/upload_file/upload_files.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função que retorna a página de login
export default function createPost() {
  const createPostContentHTML = `

  <!-- ########## MAIN ########## -->
  <main class="main main-create-post"> 
    <!-- Título da página -->
    <h1 class="primary-heading">Criar Postagem</h1>

    <!-- Formulário para criar post -->
    <form class="editor-container">
      <!-- Campo para inserir o título do post -->
      <div class="input-container">
        <input class="title-input tertiary-heading" id="title" type="text" name="title" placeholder="Sem título" />
      </div>  
      <!-- Dropdown para selecionar a categoria do post -->
      <div class="select-category">
        <input type="radio" id="interviews" name="category" value="interviews">
        <label class="checkbox" for="interviews">Entrevistas</label><br>

        <input type="radio" id="reviews" name="category" value="reviews">
        <label class="checkbox" for="reviews">Análises</label><br>

        <input type="radio" id="stories" name="category" value="stories">
        <label class="checkbox" for="stories">Histórias</label><br>

        <input type="radio" id="tips" name="category" value="tips">
        <label class="checkbox" for="tips">Dicas</label><br>

        <input type="radio" id="trends" name="category" value="trends">
        <label class="checkbox" for="trends">Tendências</label><br>
      </div>

      <!-- Upload de banner -->
      <div class="select-banner">
        <label class="paragraph-medium" for='files'>Selecionar Banner</label>
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
        <button class="button button-line" id="button-discard">Apagar</button>
        <button class="button button-line" id="button-save">Salvar</button>
        <button class="button button-fill" id="button-post">Postar</button>
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

  // Função para carregar o script da CDN do TinyMCE
  const editorContainer = createPostElement.querySelector("#editor-container");

  const textarea = document.createElement('textarea');
  textarea.id = 'mytextarea';
  textarea.style.display = 'none';
  editorContainer.appendChild(textarea);

  // Função para carregar o script da CDN do TinyMCE
  function carregarCDN() {
    return new Promise((resolve, reject) => {
        const cdnTinymce = document.createElement('script');
        cdnTinymce.src = 'https://cdn.tiny.cloud/1/uwf3bfwp12rlz75gub5bslngqa8e0hdk16ddbzgp6pmc9myb/tinymce/7/tinymce.min.js';
        cdnTinymce.referrerPolicy = 'origin';
        cdnTinymce.onload = resolve;
        cdnTinymce.onerror = reject;
        createPostElement.appendChild(cdnTinymce);
    });
  }

  const configTinymce = document.createElement('script');
  // Função para carregar o script de configuração do TinyMCE após o carregamento da CDN
  async function carregarConfiguracaoTinymce() {
    try {
        await carregarCDN(); // Aguarda o carregamento da CDN
        
        configTinymce.src = '/js/utils/upload_file/tinymce.js';
        createPostElement.appendChild(configTinymce);
        textarea.style.display = 'flex';
    } catch (error) {
        showPopup('Falha ao carregar o editor', 'Erro!', false);
    }
  }
  carregarConfiguracaoTinymce(); // Inicia o processo de carregamento da configuração do TinyMCE
  // Fim do carregamento do editor Tinymce

  const titleInput = createPostElement.querySelector('#title');
  const categoryInputs = createPostElement.querySelectorAll('input[name="category"]');

  const bannerInput = createPostElement.querySelector('#banner');
  const bannerPreview = createPostElement.querySelector('#banner-preview');
  bannerPreview.src = '/assets/images/default_image_banner.png';

  const buttonDiscard = createPostElement.querySelector('#button-discard');
  const buttonPost = createPostElement.querySelector('#button-post');
  const buttonSave = createPostElement.querySelector('#button-save');

  // Aguarda o carregamento do editor de texto
  Promise.all([
    new Promise((resolve, reject) => {
        configTinymce.addEventListener('load', resolve);
    })
  ])
  .then(([_]) => {
    // _ é uma convensão de nomenclatura para uma promisse ignorada (não será utilizada)

    buttonDiscard.addEventListener('click', (event) => {
      event.preventDefault();
      
      titleInput.value = '';
      categoryInputs.forEach((input) => {
        if (input.checked) {
          input.checked = false;
        }
      });
      bannerInput.value = '';
      bannerPreview.src = '/assets/images/default_image_banner.png';
      tinymce.activeEditor.setContent('');
    });

    buttonPost.addEventListener('click', (event) => {
      event.preventDefault();
      // Trata o conteúdo princial da postagem e salva as imagens no storage
      console.log("before", tinymce.activeEditor.getContent("myTextarea"));
      const content = importHTMLContentFilesWithFetch(tinymce.activeEditor.getContent("myTextarea"));

      console.log("content", content);

      // Efetua a postagem
      submitPost(true, content);
    });

    buttonSave.addEventListener('click', (event) => {
      event.preventDefault();
      // Trata o conteúdo princial da postagem e salva as imagens no storage
      const content = importHTMLContentFilesWithFetch(tinymce.activeEditor.getContent("myTextarea"));

      // Salva a postagem como rascunho
      submitPost(false, content);
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

  async function submitPost(posted_draft, editorContent) {
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

    buttonPost.classList.add("disabled");
    buttonPost.disabled = true;
    
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
        buttonPost.classList.remove("disabled");
        buttonPost.disabled = false;
        showPopup(error)
        console.error('Erro:', error);
      });
  }

  return createPostElement;
}