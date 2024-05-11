// login.js

import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função 'login' para que possa ser utilizada por outras partes do código
export default function forgotPassword() {
  // Esta variável armazena o código HTML que representa o layout da página de login
  const forgotPasswordContentHTML = `
<header class="header header-login">
  <div class="logo">
    <img class= "logo-image" src="/assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
    <span class="paragraph-medium">Culinária em Foco</span>
  </div>
  <div class="buttons">
    <a class="button button-fill signup-button">Registrar</a>
  </div>
</header>
<main class="main main-login">
  <h1 class="primary-heading">Redefinir Senha</h1>
  <div>
    <form class="form">
      <div class="inputs-container forgot-password">
        <div>
          <input class="input paragraph-normal" id="email" type="text" name="email" placeholder="E-mail" />
        </div>
      </div>
      <button class="button button-fill" id="button-recovery-password">Redefinir Senha</button>
    </form>
  </div>
  <p class="signup-link paragraph-medium">
    <a id="signin-span" class="interact-span">Efetuar login</a>
  </p>
</main>
  `;

  const forgotPasswordElement = document.createElement('div');
  forgotPasswordElement.classList.add('login-container');
  forgotPasswordElement.innerHTML = forgotPasswordContentHTML;

  const main = forgotPasswordElement.querySelector("main") 

  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

  forgotPasswordElement.append(footer());

  const emailInput = forgotPasswordElement.querySelector('#email');
  const buttonRecoveryPassword = forgotPasswordElement.querySelector('#button-recovery-password');
  const signInSpan = forgotPasswordElement.querySelector('#signin-span');
  const logoImage = forgotPasswordElement.querySelector('.logo-image');

  buttonRecoveryPassword.addEventListener('click', (event) => {
    event.preventDefault();

    const email = emailInput.value.toString();

    fetch(`/api/login/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message)
          })
        };

        return response.json();
      })
      .then((data) => {
        showPopup(data.result.message, "Sucesso!", data.result.success);
        emailInput.value = '';
      })
      .catch((error) => {
        showPopup(error.message, 'Erro!', false);
        console.error('Erro:', error);
      });
  });

  signInSpan.addEventListener('click', () => {
    window.dispatchEvent(createCustomEvent('/login'));
  });

  logoImage.addEventListener("click", () => {
    window.dispatchEvent(createCustomEvent(`/`));
  })

  return forgotPasswordElement;
}
