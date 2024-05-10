// Importa módulos necessários
import getTimeAgo from "../utils/getTimeAgo.js";
import footer from './elements/footer.js';
import header from './elements/header.js';
import setNavigation from "../setNavigation.js";

// Função para buscar notícias em destaque
async function getFeaturedNews(limit) {
  let url = limit ? `/api/posts/like?limit=${limit}` : `/api/posts/like?limit=1`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar notícias em destaque');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar notícias em destaque:', error);
    return null;
  }
}

// Função para buscar feed de notícias com base na categoria
async function getNewsFeed(category) {
  if (!category) category = 'latest';
  let url = category === 'latest' ? `/api/posts/latest?limit=9` : `/api/posts/category/${category}`;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Falha ao buscar notícias');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return null;
  }
}

// Função para renderizar a seção de notícias em destaque
function renderFeaturedNewsSection(news) {
  // Modelo HTML para a seção de notícias em destaque
  const featuredNewsSectionHTML = `
<div class="featured-news-container">
    <h1 class="primary-heading">Destaques</h1>
    <div class="featured-news-content">
        <div class="carousel">
            <div class="banner-container">
                <div class="banner">
                    <img class="home-banner-image">
                </div>
                <div class="navigation-container">
                    <input class="item-navigation" type="radio" name="page">
                    <input class="item-navigation" type="radio" name="page">
                    <input class="item-navigation" type="radio" name="page">
                </div>
            </div>
            <div class="info">
                <div class="details">
                    <span class="category"></span>
                    <span class="posted"></span>
                </div>
                <p class="featured-news-info-title paragraph-bold"></p>
            </div>
        </div>
    </div>
</div>
  `;
  
  const featuredNewsSection = document.createElement('section');
  featuredNewsSection.innerHTML = featuredNewsSectionHTML;

  // Seleciona elementos para manipulação
  const banner = featuredNewsSection.querySelector('.home-banner-image');
  const category = featuredNewsSection.querySelector('.category');
  const posted = featuredNewsSection.querySelector('.posted');
  const title = featuredNewsSection.querySelector('.featured-news-info-title');
  let indexPost = 0;
  let timer;

  // Atualiza conteúdo das notícias
  function updateNews() {
    // Trata notícias nulas
    if(!news) {
      category.textContent = '---';
      posted.textContent = '---';
      title.textContent = 'sem título';
      return;
    }

    banner.src = news[indexPost].banner;
    category.textContent = news[indexPost].category;
    posted.textContent = getTimeAgo(news[indexPost].updated_at);
    title.textContent = news[indexPost].title;
  }

  // Atualiza índice do post atual
  function updateIndexPost() {
    indexPost = (indexPost >= 2) ? 0 : indexPost + 1;
  }

  // Atualiza índice de navegação
  function updateIndexNavigation() {
    itemsNavigation.forEach((item) => {
      item.checked = false;
    });
    itemsNavigation[indexPost].checked = true;
  }

  // Eventos de clique para os itens de navegação
  itemsNavigation.forEach((item, index) => {
    item.addEventListener('click', () => {
      indexPost = index;
      clearInterval(timer);
      updateNews();
      timer = setInterval(() => {
        updateIndexPost();
        updateNews();
        updateIndexNavigation();
      }, 15000);
    });
  });

  // Atualização inicial
  updateNews();
  updateIndexNavigation();

  // Slideshow automático
  timer = setInterval(() => {
    updateIndexPost();
    updateNews();
    updateIndexNavigation();
  }, 15000);

  return featuredNewsSection;
}

// Função para renderizar o feed de notícias
function renderNewsFeed(news) {
  // Modelo HTML para a seção de feed de notícias
  const newsFeedHTML = `
    <div class="news-feed-container">
      <!-- Conteúdo do Feed de Notícias -->
    </div>
  `;

  const newsFeed = document.createElement('section');
  newsFeed.innerHTML = newsFeedHTML;

  // Seleciona o contêiner de conteúdo do feed de notícias
  const newsFeedContent = newsFeed.querySelector('.news-feed-content');

  // Eventos de clique para os filtros de categoria
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      getNewsFeed(filter.value).then(news => {
        renderNews(news);
      });
    });
  });

  // Funções para criar cartões de notícias e itens de notícias
  const renders = {
    createCardNews: (post) => {
      // Cria elemento de notícia
    },
    createNews: (news) => {
      // Cria elementos de notícias
    }
  };

  // Função para renderizar notícias
  function renderNews(news) {
    // Limpa conteúdo anterior e renderiza notícias
    newsFeedContent.innerHTML = '';
    newsFeedContent.appendChild(renders.createNews(news));
  }

  // Renderização inicial
  renderNews(news);

  return newsFeed;
}

// Função principal para a página inicial
export default function home() {
  // Função para criar HTML para o conteúdo da página inicial
  function createHomeContentHTML() {
    // Cria HTML do conteúdo principal
  }

  const homeElement = document.createElement('div');
  homeElement.classList.add('home-container');
  homeElement.innerHTML = createHomeContentHTML();

  // Seleciona o elemento de conteúdo principal
  const main = homeElement.querySelector(".main");

  // Insere elementos de cabeçalho e rodapé
  homeElement.insertBefore(header(), main);
  homeElement.append(footer());

  // Busca e renderiza notícias em destaque
  getFeaturedNews(3).then(news => {
    const featuredNewsSection = renderFeaturedNewsSection(news.data);
    const mainElement = homeElement.querySelector('.main-home');
    mainElement.appendChild(featuredNewsSection);
  });

  // Busca e renderiza feed de notícias
  getNewsFeed().then(news => {
    const newsFeedSection = renderNewsFeed(news.data);
    main.appendChild(newsFeedSection);
  });

  return homeElement;
}
