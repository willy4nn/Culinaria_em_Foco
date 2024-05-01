import createCustomEvent from '../eventModule.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import menuToggle from './elements/menuToggle.js';
import { modalError } from './elements/modalError.js';

// Exporta a função que retorna a página de login
export default function editor() {

  const editorContentHTML = `

    <main class=""> 

      <h1 class="title">Editor</h1>
      <div class="">

        <form method="post">
          <textarea id="mytextarea">Hello, World!</textarea>
        </form>
        <button id="button">Imprimir</button>

      </div>

      

    </main>
    
  `;

  const editorElement = document.createElement('div');
  editorElement.classList.add('create-post-element');
  editorElement.innerHTML = editorContentHTML;

  //Adiciona os elementos footer e header
  const main = editorElement.querySelector("main");
  editorElement.insertBefore(header(), main);
  editorElement.append(footer());
  editorElement.append(menuToggle());
  // Crie um elemento script
  const axiosScriptElement = document.createElement('script');
  const quillScriptElement = document.createElement('script');

  // Defina o atributo src com o URL do script externo
  /* axiosScriptElement.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
  quillScriptElement.src = 'https://cdn.quilljs.com/1.0.0/quill.js';
  quillScriptElement.id = 'quill-script';

  // Adicione o elemento script ao final do corpo do documento
  editorElement.appendChild(axiosScriptElement);
  editorElement.appendChild(quillScriptElement); */

  // Carrega o editor de texto
  /* */

  /* const popupError = modalError();
  console.log("popup", popupError);
  editorElement.appendChild(popupError); */

  const { popupCard, showPopup } = modalError();
  main.appendChild(popupCard);
  
  /* let popupCard = editorElement.getElementsByClassName("popup-card")[0];
  let closeBtn = editorElement.querySelector("#close-btn"); */



  const button = editorElement.querySelector("#button");
  button.addEventListener('click', () => {
    showPopup();
  })


  
  

  /* closeBtn.addEventListener("click", (e) => {
    popupCard.style.transform = "translateY(100vh) translateX(-16px)";
  }); */

  
  

  //window.onload = showPopup();

  return editorElement;
}
{/* <div class="popup-card">
        <button id="close-btn" class="popup-button">
          <span class="material-symbols-outlined "popup-close-icon">close</span>
        </button>

        <div>
          <span class="material-symbols-outlined popup-icon">forum</span>
        </div>

        <div class="popup-content">
          <h3>Welcome Back!</h3>
          <p>
            This is a custom Automatic Popup window. You can close this popup by
            clicking on the close icon on top right corner.
          </p>
        </div>
      </div> */}