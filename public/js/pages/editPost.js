import createCustomEvent from '../eventModule.js';
import { importHTMLContentFiles, importHTMLContentFilesWithFetch, importLocalFile } from '../utils/upload_file/upload_files.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função que retorna a página de login
export default function editPost(postId) {

  const editPostContentHTML = `
  <!-- ########## MAIN ########## -->
  <main class="main main-create-post"> 
    <!-- Título da página -->
    <h1 class="primary-heading">Editar Postagem</h1>
  
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
        <label class="paragraph-medium" for='files'>Selecione o Banner</label>
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
        <button class="button button-line" id="button-discard">Descartar</button>
        <button class="button button-fill" id="button-save-and-post">Salvar e Postar</button>
      </div>
    </form>
  </main>
  `;

  const editPostElement = document.createElement('div');
  editPostElement.classList.add('edit-post-element');
  editPostElement.innerHTML = editPostContentHTML;

  //Adiciona os elementos footer e header
  const main = editPostElement.querySelector("main") ;
  editPostElement.insertBefore(header(), main);
  editPostElement.append(footer());

  //Modal de erro
  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

  // Inicio do carregamento do editor Tinymce
  const editorContainer = editPostElement.querySelector("#editor-container");

  const textarea = document.createElement('textarea');
  textarea.id = 'mytextarea';
  textarea.style.display = 'none';
  editorContainer.appendChild(textarea);

  // Função para carregar o script da CDN do TinyMCE
  function carregarCDN() {
    return new Promise((resolve, reject) => {
        const cdnTinymce = document.createElement('script');
        cdnTinymce.src = 'https://cdn.tiny.cloud/1/uwf3bfwp12rlz75gub5bslngqa8e0hdk16ddbzgp6pmc9myb/tinymce/7/tinymce.min.js';
        cdnTinymce.onload = resolve;
        cdnTinymce.onerror = reject;
        editPostElement.appendChild(cdnTinymce);
    });
  }

  const configTinymce = document.createElement('script');
  // Função para carregar o script de configuração do TinyMCE após o carregamento da CDN
  async function carregarConfiguracaoTinymce() {
    try {
        await carregarCDN(); // Aguarda o carregamento da CDN
        
        configTinymce.src = '/js/utils/upload_file/tinymce.js';
        editPostElement.appendChild(configTinymce);
        textarea.style.display = 'flex';
    } catch (error) {
        showPopup('Falha ao carregar o editor', 'Erro!', false);
    }
  }
  carregarConfiguracaoTinymce(); // Inicia o processo de carregamento da configuração do TinyMCE
  // Fim do carregamento do editor Tinymce

  const titleInput = editPostElement.querySelector('#title');
  const categoryInputs = editPostElement.querySelectorAll('input[name="category"]');
  const bannerInput = editPostElement.querySelector('#banner');
  const bannerPreview = editPostElement.querySelector('#banner-preview');

  const buttonDiscard = editPostElement.querySelector('#button-discard');
  const buttonSaveAndPost = editPostElement.querySelector('#button-save-and-post');

  // Aguarda o carregamento do editor de texto
  Promise.all([
    new Promise((resolve, reject) => {
        configTinymce.addEventListener('load', resolve);
    })
  ])
  .then(([_]) => {

    getPostById(postId)
    .then(post => {


      titleInput.value = post.title;
      document.querySelector(`#${post.category}`).checked = true;
      bannerPreview.src = post.banner;

      setTimeout(() => {
        tinymce.activeEditor.setContent(post.content);
      }, 500); 
      
      const resetChanges = [post.title, post.category, post.content, post.banner];

      // Se clicar e não selecionar nenhum arquivo, o anterior é perdido e o seletor fica vazio
      // Isso implica que usuário não quer alterar o banner, então retorna a imagem original.
      bannerInput.addEventListener('click', () => { bannerPreview.src = '/assets/images/default_image_banner.png'; });
   
      buttonDiscard.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Volta todos os dados orignais do post
        [ titleInput.value, categoryInputs.value, , bannerPreview.src ] = resetChanges; // ignorando o terceiro parâmetro
        tinymce.activeEditor.setContent(resetChanges[2]);
        bannerInput.value = '';

      });

      buttonSaveAndPost.addEventListener('click', async (event) => {
        event.preventDefault();
  
        // Faz o upload do novo banner ou mantem o mesmo
        const banner = await bannerChange(bannerInput.files[0], post.banner);

        // Trata o conteúdo princial da postagem e salva as imagens no storage
        const content = importHTMLContentFilesWithFetch(tinymce.activeEditor.getContent("myTextarea"));

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
    const posted_draft = true;

    const data = { title, category, content, banner, posted_draft };

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
    bannerPreview.src = '/assets/images/default_image_banner.png';
  });
  bannerInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      bannerPreview.src = imageUrl;
    }
  });

  return editPostElement;
}


async function getPostById(id) {
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
      return data.data[0];
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}
