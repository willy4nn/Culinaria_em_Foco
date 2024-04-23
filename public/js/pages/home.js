// main.js

// Importa a função createCustomEvent do módulo de eventos
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';

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
    <main class="">
      
      <div id="container-news">

        <div id="featured-news">
          <div id="featured-header">
            <h1>Featured News</h1>
          </div>
          <div id="featured-content">
          </div>
        </div>

        <div id="latest-news">
          <div id="latest-header">
            <h1>Latest News</h1>
            <ul id="header-category">
              <li>Latest News</li>
              <li>Interviews</li>
              <li>Reviews</li>
              <li>Stories</li>
              <li>Tips</li>
              <li>Trends</li>
            </ul>
          <div>
          <div id="latest-content">
            <div id="left-news"></div>
            <div id="middle-news">Middle News</div>
            <div id="right-news">Right News</div>
          </div>
        </div>

      </div>

    </main>
    <footer class="footer">
        <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria o elemento principal
  const homeElement = document.createElement('div');
  homeElement.innerHTML = homeContentHTML;

  const containerNews = homeElement.querySelector('#container-news');
  const featuredNews = homeElement.querySelector('#featured-news');
  const featuredContent = homeElement.querySelector('#featured-content');

  const latestNews = homeElement.querySelector('#latest-news');
  const headerCategory = homeElement.querySelector('#header-category');
  const latestContent = homeElement.querySelector('#latest-content');
  const leftNews = homeElement.querySelector('#left-news');

  /*  window.onload = () => {} */
  /*  document.addEventListener('DOMContentLoaded', function() {}); */
  /*  window.addEventListener('load', function() {}); */
  
  
  fetch(`http://localhost:3000/api/posts/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Falha carregar postagens');
    }
    return response.json();
  })
  .then((response) => {
    renderNews(response.data);
  })
  .catch((error) => {
    console.error('Erro:', error);
  });


  function renderNews(data){
    
    containerNews.style.display = 'flex';
    containerNews.style.flexDirection = 'column';
    //containerNews.style.justifyContent = 'space-around'

    headerCategory.style.display = 'flex';
    headerCategory.style.width = '100%';
    headerCategory.style.listStyle = 'none';

    latestContent.style.display = 'flex';
    latestContent.style.justifyContent = 'space-between'

    data.forEach((item, index) => {
      
      if (index < data.length -1) {
        console.log(item);
        const div = document.createElement('div');
        const title = document.createElement('h3');
        const banner = document.createElement('img');

        title.innerText = item.title || "[no title]";
        banner.src = item.banner;

        div.style.border = 'thin solid #b1b1b1';

        div.append(title, banner);
        leftNews.appendChild(div);

        // Acessar a página completa do post
        setNavigation(div, `/post/${item.id}`);
        /* div.addEventListener('click', () => {
          window.dispatchEvent(createCustomEvent(`/post/${item.id}`));
        }); */
        

      } else {
        console.log("highlight", item);
        const div = document.createElement('div');
        const title = document.createElement('h3');
        const banner = document.createElement('img');

        title.innerText = item.title || "[no title]";
        banner.src = item.banner;
        
        div.style.border = 'thin solid #b1b1b1';

        div.append(title, banner);
        featuredContent.appendChild(div);

        // Acessar a página completa do post
        setNavigation(div, `/post/${item.id}`);

        /* div.addEventListener('click', () => {
          window.dispatchEvent(createCustomEvent(`/post/${item.id}`));
        }); */
      }

    });
  }

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
