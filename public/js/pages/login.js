//login.js

// Importa as funções necessárias
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

// Função responsável por renderizar a página de login.
export default function login() {
  // HTML que compõe a página de login.
  const loginContentHTML = `
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
      <h1 class="primary-heading">Login</h1>
      <div>
        <form class="form">
          <div class="inputs-container">
            <div>
              <input class="input paragraph-normal" id="email" type="text" name="email" placeholder="E-mail" />
            </div>
            <div>
              <input class="input paragraph-normal" id="password" type="password" name="password" placeholder="Senha"/>
            </div>
          </div>
          <a id="forgot-password-span" class="paragraph-normal">Esqueceu sua senha?</a>
          <button class="button button-fill" id="buttonSignIn">Sign In</button>
        </form>
      </div>
      <p class="signup-link paragraph-medium">
        <a id="signup-span">Não tem uma conta? Junte-se a nós!</a>
      </p>
    </main>
  `;

  // Cria um elemento div para conter o conteúdo da página de login.
  const loginElement = document.createElement('div');

  // Adiciona a classe "login-container" ao elemento div.
  loginElement.classList.add('login-container');

  // Define o HTML dentro do elemento div como o conteúdo da página de login.
  loginElement.innerHTML = loginContentHTML;

  // Seleciona o elemento <main>.
  const main = loginElement.querySelector("main") 

  // Desestrutura o retorno da função de modal de erro para obter o popupCard e a função showPopup.
  const { popupCard, showPopup } = modalError();

  // Insere o popupCard após o elemento <main>.
  main.insertAdjacentElement("afterend", popupCard);

  // Adiciona o rodapé à página de login.
  loginElement.append(footer())

  // Seleciona o input de e-mail.
  const emailInput = loginElement.querySelector('#email');

  // Seleciona o input de senha.
  const passwordInput = loginElement.querySelector('#password');

  // Seleciona o botão de login.
  const buttonSignIn = loginElement.querySelector('#buttonSignIn');

  // Seleciona o link de registro.
  const signUpSpan = loginElement.querySelector('#signup-span');

  // Seleciona o elemento do logo.
  const logo = loginElement.querySelector('.logo');

  // Configura a navegação para a página inicial ao clicar no logo.
  setNavigation(logo, '/');

  // Adiciona um ouvinte de evento ao botão de login.
  buttonSignIn.addEventListener('click', (event) => {
    // Impede o comportamento padrão do formulário.
    event.preventDefault();

    // Obtém o valor dos campos de e-mail e senha.
    const email = emailInput.value.toString();
    const password = passwordInput.value.toString();

    //Desabilita temporáriamente os botôes a fim de não lancar mais chamadas na api
    buttonSignIn.classList.add("disabled");
    buttonSignIn.disabled = true;

    // Envia uma requisição POST para a API de autenticação.
    fetch(`/api/login/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        // Verifica se a resposta da requisição não foi bem-sucedida.
        if (!response.ok) {
          // Lança um erro com a mensagem de erro retornada pela API.
          return response.json().then((error) => {
            throw new Error(error.message)
          })
        };

        // Aguarda 3 segundos e dispara um evento personalizado de redirecionamento para a página inicial.
        setTimeout(() => {
          window.dispatchEvent(createCustomEvent('/home'));
        }, 3000);

        // Exibe um popup de sucesso.
        showPopup("Login efetuado com sucesso!", "Sucesso!", true);
        return response.json();
      })
      .then((data) => {
        // Exibe os dados retornados no console.
        console.log(data);
      })
      .catch((error) => {

        //Reabilita o botão novamente
        setTimeout(() => {
          buttonSignIn.classList.remove("disabled");
          buttonSignIn.disabled = false;
        }, 2000);
        
        // Exibe um popup de erro e registra o erro no console.
        showPopup(error);
        console.error('Erro:', error);
      });
  });

  // Configura a navegação para a página de registro ao clicar no botão de registro.
  setNavigation(signUpSpan, '/register');

  // Seleciona o botão de registro.
  const signupButton = loginElement.querySelector('.signup-button');

  // Configura a navegação para a página de registro ao clicar no botão de registro.
  setNavigation(signupButton, '/register');

  // Seleciona o link "Esqueceu sua senha?".
  const forgotPasswordSpan = loginElement.querySelector('#forgot-password-span');

  // Configura a navegação para a página de recuperação de senha ao clicar no link "Esqueceu sua senha?".
  setNavigation(forgotPasswordSpan, '/forgot-password');

  // Retorna o elemento que contém o conteúdo da página de login.
  return loginElement;
}
