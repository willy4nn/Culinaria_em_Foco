// main.js

// Importa a função createCustomEvent do módulo de eventos
import setNavigation from '../setNavigation.js';

// Exporta a função principal que retorna a página principal
export default function main() {
  // HTML do elemento principal
  const mainContentHTML = `
    <header class="header header-main">
  <div class="logo">
    <img class= "logo-image" src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner">
    <span class="paragraph-medium">Chef's Corner</span>
  </div>
  <div class="buttons">
    <a class="button button-line signin-button">Sign In</a>
    <a class="button button-fill signup-button">Sign Up</a>
  </div>
</header>
<main class="main main-main">
  <div class="text-container">
    <h1 class="primary-heading">Arouse your palate to new culinary experiences.</h1>
    <p class="paragraph-normal">Discover unique flavors and culinary inspirations in our featured digital magazine. Creative recipes, chef tips, and stories that will transform your kitchen into a true stage of delights. Explore with us the world of gastronomy!</p>
    <div class="buttons">
      <a class="button button-line signin-button">Sign In</a>
      <a class="button button-fill signup-button">Sign Up</a>
    </div>
  </div>
  <div class="image-container">
    <img src="./assets/images/initial-main-image.jpg" alt="">
  </div>
</main>
<footer class="footer footer-main">
    <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
</footer>
  `;

  // Cria o elemento principal
  const mainElement = document.createElement('div');
  mainElement.classList.add('main-container');
  mainElement.innerHTML = mainContentHTML;

  // Adiciona um ouvinte de evento ao botão de login
  const signinButtons = mainElement.querySelectorAll('.signin-button');
  signinButtons.forEach((button) => {
    setNavigation(button, '/login');
  });

  const signupButtons = mainElement.querySelectorAll('.signup-button');
  signupButtons.forEach((button) => {
    setNavigation(button, '/register');
  });

  // Retorna o elemento principal
  return mainElement;
}
