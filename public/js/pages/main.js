// main.js

// Importa a função createCustomEvent do módulo de eventos
import setNavigation from '../setNavigation.js';

// Exporta a função principal que retorna a página principal
export default function main() {
  // HTML do elemento principal
  const mainContentHTML = `
    <header class="header header-main">
  <div class="logo">
    <img class= "logo-image" src="/assets/images/croissant-logo.svg" alt="Logo Culinária em Foco">
    <span class="paragraph-medium">Culinária em Foco</span>
  </div>
  <div class="buttons">
    <a class="button button-line signin-button">Entrar</a>
    <a class="button button-fill signup-button">Registrar</a>
  </div>
</header>
<main class="main main-main">
  <div class="text-container">
    <h1 class="primary-heading">Aguçe seu paladar com novas experiências Culinárias.</h1>
    <p class="paragraph-normal">Descubra sabores únicos e inspirações culinárias em nossa revista digital em destaque. Receitas criativas, dicas de chefs e histórias que vão transformar sua cozinha em um verdadeiro palco de delícias. Explore conosco o mundo da gastronomia!</p>
    <div class="buttons">
      <a class="button button-line signin-button">Entrar</a>
      <a class="button button-fill signup-button">Registrar</a>
    </div>
  </div>
  <div class="image-container">
    <img src="/assets/images/initial-main-image.jpg" alt="">
    <img src="/assets/images/initial-main-image.jpg" alt="">
  </div>
</main>
<footer class="footer footer-main">
    <p class="paragraph-medium">© 2024 Culinária em Foco. Todos os direitos reservados.</p>
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
