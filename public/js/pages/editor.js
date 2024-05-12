import createCustomEvent from '../eventModule.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função que retorna a página de login
export default function editor() {

  const editorContentHTML = `

    <main class=""> 

      <h1 class="title">Editor</h1>
      <div class="">

        <form id="textarea-form" method="post">
          
        </form>
        <button id="button">Imprimir</button>

      </div>

      

    </main>
    
  `;

  //<textarea id="mytextarea">Hello, World!</textarea>

  const editorElement = document.createElement('div');
  editorElement.classList.add('create-post-element');
  editorElement.innerHTML = editorContentHTML;

  //Adiciona os elementos footer e header
  const main = editorElement.querySelector("main");
  editorElement.insertBefore(header(), main);
  editorElement.append(footer());

  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);
  

  const textareaForm = editorElement.querySelector("#textarea-form");


  const cdnTinymce = document.createElement('script');
  cdnTinymce.src = 'https://cdn.tiny.cloud/1/uwf3bfwp12rlz75gub5bslngqa8e0hdk16ddbzgp6pmc9myb/tinymce/7/tinymce.min.js';
  editorElement.appendChild(cdnTinymce);

  const textarea = document.createElement('textarea');
  textarea.id = 'mytextarea';
  textarea.style.display = 'none';
  textareaForm.appendChild(textarea);

  setTimeout(() => {
    try {
      const configTinymce = document.createElement('script');
      configTinymce.src = '/js/utils/upload_file/tinymce.js';
      editorElement.appendChild(configTinymce);
      textarea.style.display = 'flex';
    } catch (error) {
      showPopup('O editor não conseguiu carregar corretamente, por favor atualize a página', 'Erro!', false);
    }
    
  }, 1000); 

 



  const button = editorElement.querySelector("#button");
  button.addEventListener('click', () => {
    const content = tinymce.activeEditor.getContent("myTextarea");
    console.log(content);
  })



  return editorElement;
}
