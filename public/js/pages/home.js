// Importa os módulos necessários
import createCustomEvent from '../eventModule.js';
import footer from './elements/footer.js'
import header from './elements/header.js'
import menuToggle from './elements/menuToggle.js';

// Função principal que renderiza a página inicial
export default function home() {
  // HTML do conteúdo da página inicial
  const homeContentHTML = `

    <main class="main main-home">
      <div class="featured-news-container">
          <h1 class="primary-heading">Featured News</h1>
          <div class="featured-news-content">
          </div>
      </div>
    </main>
  `;

  // Cria um elemento div para a página inicial
  const homeElement = document.createElement('div');
  homeElement.classList.add('home-container');
  homeElement.innerHTML = homeContentHTML;

  //Adiciona os elementos footer e header
  const main = homeElement.querySelector("main") 
  homeElement.insertBefore(header(), main)
  homeElement.append(footer())
  homeElement.append(menuToggle())

  // Seleciona o contêiner do conteúdo em destaque
  const featuredNewsContent = homeElement.querySelector('.featured-news-content');

  // Busca os posts em destaque da API
  fetch('/api/posts/like?limit=3')
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
        console.log('Teste');
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
    elements.title.innerHTML = posts[index].title;
    elements.bannerImage.src = posts[index].banner;
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

// Função para obter o tempo desde a postagem
function getTimeAgo(postDate) {
  const currentDate = new Date();
  const postDateObj = new Date(postDate);

  const timeDifference = currentDate.getTime() - postDateObj.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days + (days === 1 ? ' day ago' : ' days ago');
  else if (hours > 0) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  else if (minutes > 0) return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
  else return 'Just now';
}
