// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';

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
    <a class="button button-fill signin-button">Sign In </a>
  </div>
</header>
<main class="main main-register">
  <h1 class="primary-heading">Register</h1>
  <div>
    <form class="form">
    <div class="inputs-container">
      <div>
        <input
          class="input paragraph-normal"
          id="name"
          type="text"
          name="name"
          placeholder="User Name"
          required
        />
      </div>
      <div>
        <input
          class="input paragraph-normal"
          id="username"
          type="text"
          name="username"
          placeholder="Full Name"
          required
        />
      </div>
      <div>
        <input
          class="input paragraph-normal"
          id="email"
          type="email"
          name="email"
          placeholder="Email Address"
          required
        />
      </div>
      <div>
        <input
          class="input paragraph-normal"
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
      </div>
    </div>
      <button class="button button-fill" id="buttonSignUp">Register</button>
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

  const nameInput = registerElement.querySelector('#name');
  const usernameInput = registerElement.querySelector('#username');
  const emailInput = registerElement.querySelector('#email');
  const passwordInput = registerElement.querySelector('#password');

  const registerButton = registerElement.querySelector('#buttonSignUp');
  registerButton.addEventListener('click', () => {
    const name = nameInput.value.toString();
    const username = usernameInput.value.toString();
    const email = emailInput.value.toString();
    const password = passwordInput.value.toString();

    fetch(`http://localhost:3000/api/login/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, email, password }),
    })
      .then((response) => {
        // Esta linha verifica se a resposta do servidor é bem-sucedida
        if (!response.ok) {
          throw new Error('Falha no login');
        }
        // Esta linha retorna os dados da resposta em formato JSON
        window.dispatchEvent(createCustomEvent('/home'));
        return response.json();
      })
      .then((data) => {
        // Esta linha registra os dados recebidos do servidor no console (você pode substituir isso por sua própria lógica para lidar com a resposta)
        console.log(data);
      })
      .catch((error) => {
        // Esta linha captura qualquer erro que ocorra durante o processo de login
        console.error('Erro:', error);
      });
  });

  const signinButton = registerElement.querySelector('.signin-button');
  setNavigation(signinButton, '/login');

  // Retorna o elemento principal
  return registerElement;
}
