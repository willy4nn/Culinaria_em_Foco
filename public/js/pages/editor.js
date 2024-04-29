import createCustomEvent from '../eventModule.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import menuToggle from './elements/menuToggle.js';

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
  const main = editorElement.querySelector("main") 
  editorElement.insertBefore(header(), main)
  editorElement.append(footer())
  editorElement.append(menuToggle())
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
  

  

  return editorElement;
}
