// login.js

import createCustomEvent from '../eventModule.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função 'login' para que possa ser utilizada por outras partes do código
export default function recoveryPassword(token) {
  // Esta variável armazena o código HTML que representa o layout da página de login
  const recoveryPasswordContentHTML = `
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
  <h1 class="primary-heading">Nova senha</h1>
  <div>
    <form class="form">
      <div class="inputs-container">
        <div>
          <input class="input paragraph-normal" id="first-password" type="password" name="password" placeholder="Nova senha" />
        </div>
        <div>
          <input class="input paragraph-normal" id="second-password" type="password" name="password" placeholder="Repita a senha" />
        </div>
      </div>
      <button class="button button-fill" id="button-confirm">Confirmar</button>
    </form>
  </div>
  <p class="signup-link paragraph-medium">
    <a id="signin-span" class="interact-span">Efetuar login</a>
  </p>
</main>
  `;

  const recoveryPasswordElement = document.createElement('div');
  recoveryPasswordElement.classList.add('login-container');
  recoveryPasswordElement.innerHTML = recoveryPasswordContentHTML;

  const main = recoveryPasswordElement.querySelector("main") 

  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

  recoveryPasswordElement.append(footer());

  const firstPassword = recoveryPasswordElement.querySelector('#first-password');
  const secondPassword = recoveryPasswordElement.querySelector('#second-password');
  const buttonConfirm = recoveryPasswordElement.querySelector('#button-confirm');
  const signInSpan = recoveryPasswordElement.querySelector('#signin-span');
  const logoImage = recoveryPasswordElement.querySelector('.logo-image');

  buttonConfirm.addEventListener('click', (event) => {
    event.preventDefault();

    //Desabilita temporáriamente os botôes a fim de não lancar mais chamadas na api
    buttonConfirm.classList.add("disabled");
    buttonConfirm.disabled = true;

    const form = {
      firstPassword: firstPassword.value,
      secondPassword: secondPassword.value
    };

    const erro = validatePassword(form);

    if (erro) {
      buttonConfirm.classList.remove("disabled");
      buttonConfirm.disabled = false;
      showPopup(erro, "Erro!", false);
      return;
    }

    fetch(`/api/login/recovery-password/` + token, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: form.firstPassword }),
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

        // Aguarda 3 segundos e dispara um evento personalizado de redirecionamento para a página inicial.
        setTimeout(() => {
          window.dispatchEvent(createCustomEvent('/login'));
        }, 3000);

        showPopup(data.result.message, "Sucesso!", data.result.success);
        firstPassword.value = '';
        secondPassword.value = '';
      })
      .catch((error) => {
        buttonConfirm.classList.remove("disabled");
        buttonConfirm.disabled = false;
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

  return recoveryPasswordElement;
}


function validatePassword(form){
  if (form.firstPassword.trim() === '' || form.secondPassword.trim() === '') return 'As senhas não podem ser nulas';
  if (form.firstPassword.trim() !== form.secondPassword.trim()) return 'As senhas são diferentes';
  if (form.firstPassword.trim().length < 8 || form.secondPassword.trim() < 8) return 'A senha precisa ter no mínimo 8 caracteres';
}