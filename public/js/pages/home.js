// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';

// Exporta a função principal que retorna a página principal
export default function home() {
  // HTML do elemento principal
  const homeContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner">
        <span class="paragraph-medium">Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-line">Sign In</a>
        <a class="button button-fill">Sign Up</a>
      </div>
    </header>
    <main class="initial-main">
     <h1>Página Home<h1>
    </main>
    <footer class="footer">
        <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria o elemento principal
  const homeElement = document.createElement('div');
  homeElement.innerHTML = homeContentHTML;

  // Retorna o elemento principal
  return homeElement;
}
