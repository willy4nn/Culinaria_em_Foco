// login.js

import { response } from 'express';

// Exporta a função que retorna a página de login
export default function login() {
  // HTML do elemento de login
  const loginContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
        <span>Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-fill">Sign Up</a>
      </div>
    </header>
    <main class="login-main"> 
      <h1 class="title">Login</h1>
      <div class="box-login">
        <form class="form">
          <div class="input-container">
            <input id="email" type="text" name="email" placeholder="Email Address" />
          </div>  
          <div class="input-container">
            <input id="password" type="password" name="password" placeholder="Password"/>
          </div>
          <a>Forgot your password?</a>
          <button id="buttonSignIn">Sign In</button>
        </form>
      </div>
      <a class="login-link">Don’t have an account? Sign up</a>
    </main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria o elemento de login
  const loginElement = document.createElement('div');
  loginElement.classList.add('login-element');
  loginElement.innerHTML = loginContentHTML;

  // Pegando valores dos inputs
  const emailInput = loginElement.querySelector('#email');
  const passwordInput = loginElement.querySelector('#password');

  // Pegando o botão de login
  const buttonSignIn = loginElement.querySelector('#buttonSignIn');
  buttonSignIn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    // fetch(`localhost:3000/api/login/auth`, {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: {
    //     username: '',
    //     password: '',
    //   },
    // }).then((response) => console.log(response));
  });

  // Retorna o elemento de login
  return loginElement;
}
