// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';

// Exporta a função principal que retorna a página principal
export default function home() {
  // HTML do elemento principal
  const homeContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner">
        <span class="paragraph-medium">Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="paragraph-medium">Contact Us</a>
        <a class="button button-fill logout">Logout</a>
      </div>
    </header>
    <main class="initial-main">
     <h1>Página Home<h1>
    </main>
    <footer class="footer">
        <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria o elemento principal
  const homeElement = document.createElement('div');
  homeElement.innerHTML = homeContentHTML;
  
  const logoutButton = homeElement.querySelector('.logout');
  logoutButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/api/login/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // Esta linha verifica se a resposta do servidor é bem-sucedida
        if (!response.ok) {
          throw new Error('Falha no logout');
        }
        // Esta linha retorna os dados da resposta em formato JSON
        window.dispatchEvent(createCustomEvent('/login'));
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

  // Retorna o elemento principal
  return homeElement;
}
