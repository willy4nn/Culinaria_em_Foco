// login.js

import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Exporta a função 'login' para que possa ser utilizada por outras partes do código
export default function login() {
  // Esta variável armazena o código HTML que representa o layout da página de login
  const loginContentHTML = `
<header class="header header-login">
  <div class="logo">
    <img class= "logo-image" src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
    <span class="paragraph-medium">Culinária em Foco</span>
  </div>
  <div class="buttons">
    <a class="button button-fill signup-button">Registrar</a>
  </div>
</header>
<main class="main main-login">
  <h1 class="primary-heading">Login</h1>
  <div>
    <form class="form">
      <div class="inputs-container">
        <div>
          <input class="input paragraph-normal" id="email" type="text" name="email" placeholder="Email Address" />
        </div>
        <div>
          <input class="input paragraph-normal" id="password" type="password" name="password" placeholder="Password"/>
        </div>
      </div>
      <!-- <a class="paragraph-normal">Forgot you password?</a> -->
      <button class="button button-fill" id="buttonSignIn">Sign In</button>
    </form>
  </div>
  <p class="signup-link paragraph-medium">
    <a id="signup-span" class="interact-span">Não possui uma Conta? Cadastre-se</a>
  </p>
</main>
  `;

  

  // Esta linha cria um novo elemento HTML do tipo 'div'
  const loginElement = document.createElement('div');

  // Esta linha adiciona a classe 'login-element' ao elemento div criado
  loginElement.classList.add('login-container');

  // Esta linha define o innerHTML do elemento div para o loginContentHTML (que contém o layout da página de login)
  loginElement.innerHTML = loginContentHTML;

  //Adiciona o elemento footer
  const main = loginElement.querySelector("main") 

  //Modal de erro
  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

  loginElement.append(footer())

  // Esta linha seleciona o elemento com o id 'email' do loginElement (que é o campo de entrada de email)
  const emailInput = loginElement.querySelector('#email');

  // Esta linha seleciona o elemento com o id 'password' do loginElement (que é o campo de entrada da senha)
  const passwordInput = loginElement.querySelector('#password');

  // Esta linha seleciona o elemento com o id 'buttonSignIn' do loginElement (que é o botão de login)
  const buttonSignIn = loginElement.querySelector('#buttonSignIn');
  const signUpSpan = loginElement.querySelector('#signup-span');

  // Esta função adiciona um ouvinte de evento ao elemento buttonSignIn. Quando o botão é clicado, o código dentro da função será executado
  buttonSignIn.addEventListener('click', (event) => {
    // Esta linha evita o comportamento padrão do botão, que é enviar o formulário
    event.preventDefault();
    // Esta linha define duas variáveis com nome de usuário e senha (altere-as para suas credenciais reais)
    const email = emailInput.value.toString();
    const password = passwordInput.value.toString();

    // Esta linha envia uma requisição POST para o servidor com o nome de usuário e senha no corpo da requisição
    fetch(`http://localhost:3000/api/login/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
        showPopup(error);
        // Esta linha captura qualquer erro que ocorra durante o processo de login
        console.error('Erro:', error);
      });
  });

  signUpSpan.addEventListener('click', () => {
    window.dispatchEvent(createCustomEvent('/register'));
  });

  const signupButton = loginElement.querySelector('.signup-button');
  setNavigation(signupButton, '/register');

  // Esta linha retorna o loginElement que contém todo o layout da página de login
  return loginElement;
}
