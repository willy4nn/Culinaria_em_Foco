import createCustomEvent from '../eventModule.js';

// Exporta a função que retorna a página de login
export default function displayNews() {
  // HTML do elemento de login
  const getPostContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
        <span>Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-fill">Sign Up</a>
      </div>
    </header>
    <main class=""> 

      <button id="button-get">Buscar</button>
      <input id="input-id" placeholder="ID do Post"></input>

      <div id="news-container">
      </div>

    </main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  const getPostElement = document.createElement('div');
  getPostElement.classList.add('create-post-element');
  getPostElement.innerHTML = getPostContentHTML;

  const buttonGet = getPostElement.querySelector('#button-get');
  const inputId = getPostElement.querySelector('#input-id');
  const newsContainer = getPostElement.querySelector('#news-container');

  buttonGet.addEventListener('click', async () => {

    // Faz requisição de consulta de post por ID
    getPostById(inputId.value)
    .then(data => {
      const title = document.createElement('h1');
      const content = document.createElement('content');

      title.innerText = data.title;
      content.innerHTML = data.content;

    newsContainer.append(title, content);
    })
    .catch(error => {
      console.error('Erro ao buscar post:', error);
    });
  });

  return getPostElement;
}

async function getPostById(id) {
  return fetch('http://localhost:3000/api/posts/' + id)
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      console.log("get post :", data);
      return data.data[0];
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}
