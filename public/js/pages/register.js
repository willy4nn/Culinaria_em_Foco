// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';

// Exporta a função principal que retorna a página principal
export default function register() {
  // HTML do elemento principal
  const registerContentHTML = `
<header class="header header-register">
  <div class="logo">
    <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
    <span class="paragraph-medium">Chef's Corner</span>
  </div>
  <div class="buttons">
    <a class="button button-fill">Register</a>
  </div>
</header>
<main class="main main-register">
  <h1 class="primary-heading">Register</h1>
  <div>
    <form>
      <div>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="User Name"
          required
        />
      </div>
      <div>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Full Name"
          required
        />
      </div>
      <div>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email Address"
          required
        />
      </div>
      <div>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
      </div>
      <button id="buttonSignUp">Register</button>
    </form>
  </div>
  <a class="signin-link paragraph-medium">Already have an account? Sign in</a>
</main>
<footer class="footer footer-register">
  <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
</footer>

  `;

  // Cria o elemento principal
  const registerElement = document.createElement('div');
  registerElement.classList.add('register-container');
  registerElement.innerHTML = registerContentHTML;

  // Retorna o elemento principal
  return registerElement;
}
