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

  const signinButton = registerElement.querySelector('.signin-button');
  setNavigation(signinButton, '/login');
 
  const buttonSignUp = registerElement.querySelector("#buttonSignUp")
  const btnName = registerElement.querySelector("#name");
  const btnUsername = registerElement.querySelector("#username");
  const btnEmail = registerElement.querySelector("#email");
  const btnPassword = registerElement.querySelector("#password");

  buttonSignUp.addEventListener("click", (event)=>{
    event.preventDefault();

    const payload = {
      name: btnName.value, 
      username: btnUsername.value, 
      email: btnEmail.value, 
      password: btnPassword.value
    }

    fetch("http://localhost:3000/api/login/register" , {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...payload })
    })
    .then((response) => {
      if (!response.ok){
        return response.json().then(error => {
          throw new Error(`Não foi possível realizar o cadastro! ${error.message}`);
      })
    }
      window.dispatchEvent(createCustomEvent('/login'));
      return response.json();
    })
    .then((data) =>{
      console.log(data)
    })
    .catch((err) =>{
      console.error(err)
    });
  })

  // Retorna o elemento principal
  return registerElement;
}
