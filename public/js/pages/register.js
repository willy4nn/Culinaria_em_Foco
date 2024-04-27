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
  <h1 class="primary-heading">Registrar</h1>
  <div>
    <form class="form">
    <div class="inputs-container">
      <div>
        <input
          class="input paragraph-normal"
          id="username"
          type="text"
          name="username"
          placeholder="Apelido"
          required
        />
      </div>
      <div>
        <input 
          class="input paragraph-normal"
          id="name"
          type="text"
          name="name"
          placeholder="Nome Completo"
          required
        />
      </div>
      <div>
        <input
          class="input paragraph-normal"
          id="email"
          type="email"
          name="email"
          placeholder="Endereço de Email"
          required
        />
      </div>
      <div>
        <input
          class="input paragraph-normal"
          id="password1"
          type="password"
          name="password"
          placeholder="Senha"
          required
        />
      </div>
      <div>
        <input
          class="input paragraph-normal"
          id="password2"
          type="password"
          name="password"
          placeholder="Repita a Senha"
          required
        />
      </div>
    </div>
      <button class="button button-fill" id="buttonSignUp">Registrar</button>
    </form>
  </div>
  <a class="signin-link paragraph-medium">Já possui uma conta? Entre!</a>
</main>
<footer class="footer footer-register">
  <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
</footer>

  `;

  // Cria o elemento principal
  const registerElement = document.createElement('div');
  registerElement.classList.add('register-container');
  registerElement.innerHTML = registerContentHTML;

  const signinButton = registerElement.querySelector('.signin-button');
  const signinLink = registerElement.querySelector('.signin-link');
  setNavigation(signinLink, '/login');
  setNavigation(signinButton, '/login');

  const buttonSignUp = registerElement.querySelector('#buttonSignUp');
  const inptName = registerElement.querySelector('#name');
  const inptUsername = registerElement.querySelector('#username');
  const inptEmail = registerElement.querySelector('#email');
  const inptPassword1 = registerElement.querySelector('#password1');
  const inptPassword2 = registerElement.querySelector('#password2');

  buttonSignUp.addEventListener('click', (event) => {
    event.preventDefault();

    if (inptPassword1.value !== inptPassword2.value){
      return console.log("As senhas não coincidem")
    }

    const payload = {
      name: inptName.value,
      username: inptUsername.value,
      email: inptEmail.value,
      password: inptPassword1.value,
    };

    fetch('http://localhost:3000/api/login/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...payload }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(
              `Não foi possível realizar o cadastro! ${error.message}`
            );
          });
        }
        window.dispatchEvent(createCustomEvent('/login'));
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err)
        console.error(err);
      });
  });

  // Retorna o elemento principal
  return registerElement;
}
