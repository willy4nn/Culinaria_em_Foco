import createCustomEvent from '../eventModule.js';

// Exporta a função que retorna a página de login
export default function editor() {

  const editorContentHTML = `
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

      <h1 class="title">Editor</h1>
      <div class="">

        <form method="post">
          <textarea id="mytextarea">Hello, World!</textarea>
        </form>
        <button id="button">Imprimir</button>

      </div>

    </main>
    <footer class="footer">
      <p class="paragraph-medium">© 2024 Culinária em Foco. Todos os direitos Reservados.</p>
    </footer>

    
  `;

  const editorElement = document.createElement('div');
  editorElement.classList.add('create-post-element');
  editorElement.innerHTML = editorContentHTML;
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
