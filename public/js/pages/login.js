// login.js

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
            <input type="text" name="email" placeholder="Email Address" />
          </div>  
          <div class="input-container">
            <input type="password" name="password" placeholder="Password"/>
          </div>
          <a>Forgot your password?</a>
          <button>Sign In</button>
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

  // Retorna o elemento de login
  return loginElement;
}
