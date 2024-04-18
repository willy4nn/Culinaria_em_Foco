// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';

// Exporta a função principal que retorna a página principal
export default function main() {
  // HTML do elemento principal
  const mainContentHTML = `
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
      <div class="main-content-text">
        <h1 class="primary-heading">Arouse your palate to new culinary experiences.</h1>
        <p class="paragraph-normal">Discover unique flavors and culinary inspirations in our featured digital magazine. Creative recipes, chef tips, and stories that will transform your kitchen into a true stage of delights. Explore with us the world of gastronomy!</p>
        <div class="buttons">
          <a id="signInButton" class="button button-line">Sign In</a>
          <a id="signUpButton" class="button button-fill">Sign Up</a>
        </div>
      </div>
      <div class="main-content-image">
        <img src="./assets/images/initial-main-image.jpg" alt="">
      </div>
    </main>
    <footer class="footer">
        <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria o elemento principal
  const mainElement = document.createElement('div');
  mainElement.innerHTML = mainContentHTML;

  // Adiciona um ouvinte de evento ao botão de login
  const signInButton = mainElement.querySelector('#signInButton');
  signInButton.addEventListener('click', () => {
    // Dispara um evento personalizado de login
    const event = createCustomEvent('/login');
    window.dispatchEvent(event);
  });

  const signUpButton = mainElement.querySelector('#signUpButton');
  signUpButton.addEventListener('click', () => {
    // Dispara um evento personalizado de login
    const event = createCustomEvent('/register');
    window.dispatchEvent(event);
  });

  // Retorna o elemento principal
  return mainElement;
}
