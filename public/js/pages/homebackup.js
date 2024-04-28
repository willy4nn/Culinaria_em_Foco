// Importa os módulos necessários
import createCustomEvent from '../eventModule.js';
import getTimeAgo from '../utils/getTimeAgo.js'

// Função principal que renderiza a página inicial
export default function home() {
  // HTML do conteúdo da página inicial
  const homeContentHTML = `
    <header class="header header-home">
      <div class="logo">
          <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner">
          <span class="paragraph-medium">Chef's Corner</span>
      </div>
      <div class="buttons">
          <a class="paragraph-medium">Contact Us</a>
          <a class="button button-fill logout">Logout</a>
      </div>
    </header>
    <main class="main main-home">
      <div class="featured-news-container">
          <h1 class="primary-heading">Featured News</h1>
          <div class="featured-news-content">
          
          </div>
      </div>
    </main>
    <footer class="footer footer-home">
        <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria um elemento div para a página inicial
  const homeElement = document.createElement('div');
  homeElement.classList.add('home-container');
  homeElement.innerHTML = homeContentHTML;

  // Seleciona o contêiner do conteúdo em destaque
  const featuredNewsContent = homeElement.querySelector('.featured-news-content');

  // Busca os posts em destaque da API
  fetch('http://localhost:3000/api/posts/like?limit=3')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      featuredNewsContent.appendChild(renderCarousel(data.data));
    })
    .catch(error => console.error('Erro:', error));

  // Adiciona um ouvinte de eventos para o botão de logout
  const logoutButton = homeElement.querySelector('.logout');
  logoutButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/api/login/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha no logout');
        }
        window.dispatchEvent(createCustomEvent('/login'));
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
  });

  // Retorna o elemento da página inicial
  return homeElement;
}

// Função para renderizar o carrossel de posts em destaque
function renderCarousel(posts) {
  // HTML do carrossel
  const carouselElementHTML = `
    <div class="featured-news-banner">
      <div class="featured-news-banner-container">
        <img class="featured-news-banner-image">
        </div>
         <div class="featured-news-navigation">
            <input class="item-navigation" type="radio" name="cor">
            <input class="item-navigation" type="radio" name="cor">
            <input class="item-navigation" type="radio" name="cor">
          </div>
      </div>
      <div class="featured-news-info">
        <div class="featured-news-details">
          <span class="category"></span>
          <div class="divider"></div>
          <span class="posted"></span>
        </div>
        <p class="featured-news-info-title paragraph-medium"></p>
      </div>
    </div>
  `;
  const carouselElement = document.createElement('div');
  carouselElement.classList.add('carousel-container');
  carouselElement.innerHTML = carouselElementHTML;

  // Seleciona os elementos do carrossel
  const bannerImage = carouselElement.querySelector('.featured-news-banner-image');
  const category = carouselElement.querySelector('.category');
  const posted = carouselElement.querySelector('.posted');
  const title = carouselElement.querySelector('.featured-news-info-title');

  const elements = {
    bannerImage,
    category,
    posted,
    title
  };

  let indexPost = 0;
  let timer;
  updateFeaturedNews(indexPost, elements);

  // Adiciona ouvintes de eventos para a navegação do carrossel
  const itemsNavigation = carouselElement.querySelectorAll('.item-navigation');
  itemsNavigation.forEach((item, index) => {
    item.addEventListener('click', () => {
      clearInterval(timer);
      indexPost = index;
      updateFeaturedNews(indexPost, elements);
      timer = setInterval(() => {
        updateFeaturedNews(indexPost, elements);
        updateIndexPost();
      }, 60000);
    });
  });

  itemsNavigation[0].checked = true;


  // Atualiza automaticamente o carrossel a cada minuto
  timer = setInterval(() => {
    updateIndexPost();
    updateFeaturedNews(indexPost, elements);
  }, 60000);

  // Função para atualizar o conteúdo em destaque
  function updateFeaturedNews(index, elements) {
    elements.category.innerHTML = posts[index].category;
    elements.posted.innerHTML = getTimeAgo(posts[index].updated_at);
    console.log('Horas:', getTimeAgo(posts[index].updated_at));
    elements.title.innerHTML = posts[index].title;
    updateIndexPost();
  }

  // Função para atualizar o índice do post exibido
  function updateIndexPost() {
    if (indexPost >= 2) {
      indexPost = 0;
    } else {
      indexPost++;
    }
  }

  return carouselElement;
}

