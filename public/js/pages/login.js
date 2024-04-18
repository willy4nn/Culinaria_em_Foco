// login.js

import createCustomEvent from '../eventModule.js';

// Exporta a função 'login' para que possa ser utilizada por outras partes do código
export default function login() {
  // Esta variável armazena o código HTML que representa o layout da página de login
  const loginContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
        <span class="paragraph-medium">Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-fill">Cadastre-se</a>
      </div>
    </header>
    <main class="login-main">
      <h1 class="primary-heading">Login</h1>
      <div class="box-login">
        <form class="form">
          <div class="input-container">
            <input id="email" type="text" name="email" placeholder="Endereço de e-mail" />
          </div>
          <div class="input-container">
            <input id="password" type="password" name="password" placeholder="Senha"/>
          </div>
          <a class="paragraph-normal">Esqueceu sua senha?</a>
          <button id="buttonSignIn">Entrar</button>
        </form>
      </div>
      <a class="login-link paragraph-medium">Não tem uma conta? Cadastre-se</a>
    </main>
    <footer class="footer">
      <p class="paragraph-medium">© 2024 Chef's Corner. Todos os direitos reservados.</p>
    </footer>
  `;

  // Esta linha cria um novo elemento HTML do tipo 'div'
  const loginElement = document.createElement('div');

  // Esta linha adiciona a classe 'login-element' ao elemento div criado
  loginElement.classList.add('login-element');

  // Esta linha define o innerHTML do elemento div para o loginContentHTML (que contém o layout da página de login)
  loginElement.innerHTML = loginContentHTML;

  // Esta linha seleciona o elemento com o id 'email' do loginElement (que é o campo de entrada de email)
  const emailInput = loginElement.querySelector('#email');

  // Esta linha seleciona o elemento com o id 'password' do loginElement (que é o campo de entrada da senha)
  const passwordInput = loginElement.querySelector('#password');

  // Esta linha seleciona o elemento com o id 'buttonSignIn' do loginElement (que é o botão de login)
  const buttonSignIn = loginElement.querySelector('#buttonSignIn');

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
        // Esta linha captura qualquer erro que ocorra durante o processo de login
        console.error('Erro:', error);
      });
  });

  // Esta linha retorna o loginElement que contém todo o layout da página de login
  return loginElement;
}
