// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função principal que retorna a página principal
export default function register() {
  // HTML do elemento principal
  const registerContentHTML = `
<header class="header header-register">
  <div class="logo">
    <img src="/assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
    <span class="paragraph-medium">Chef's Corner</span>
  </div>
  <div class="buttons">
    <a class="button button-fill signin-button">Entrar</a>
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
  <a class="signin-link paragraph-medium interact-span">Já possui uma conta? Entre!</a>
</main>

  `;

  // Cria o elemento principal
  const registerElement = document.createElement('div');
  registerElement.classList.add('register-container');
  registerElement.innerHTML = registerContentHTML;

  //Adiciona os elementos footer e header
  const main = registerElement.querySelector("main") 
  registerElement.append(footer())

  //Modal de erro
  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

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

    const payload = {
      name: inptName.value,
      username: inptUsername.value,
      email: inptEmail.value,
      password: inptPassword1.value,
      password2: inptPassword2.value,
    };

    fetch('/api/login/register', {
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
        //alert(err)
        showPopup(err);
        console.error(err);
      });
  });

  // Retorna o elemento principal
  return registerElement;
}
