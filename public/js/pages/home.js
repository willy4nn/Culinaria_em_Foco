// home.js

// Importa as funções necessárias
import getTimeAgo from "../utils/getTimeAgo.js";
import footer from './elements/footer.js';
import header from './elements/header.js';
import setNavigation from "../setNavigation.js";

// Função assíncrona para obter notícias em destaque com um limite opcional
async function getFeaturedNews(limit) {
  // Define a URL com base no limite fornecido ou um limite padrão
  let url = limit ? `/api/posts/like?limit=${limit}` : `/api/posts/like?limit=1`;

  try {
    // Faz uma solicitação fetch para a URL
    const response = await fetch(url);
    
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Failed to fetch featured news');
    }
    
    // Retorna os dados obtidos da resposta como JSON
    return await response.json();
  } catch (error) {
    // Registra um erro caso haja problemas com a solicitação
    console.error('Error fetching featured news:', error);
    
    // Retorna null em caso de erro
    return null;
  }
}

// Função assíncrona para obter o feed de notícias de uma determinada categoria
async function getNewsFeed(category) {
  // Se não houver categoria especificada, define como 'latest'
  if (!category) category = 'latest';
  
  // Define a URL com base na categoria fornecida
  let url = category === 'latest' ? `/api/posts/latest?limit=15` : `/api/posts/category/${category}`;
  
  try {
    // Faz uma solicitação fetch para a URL
    const response = await fetch(url);
    
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    // Retorna os dados obtidos da resposta como JSON
    return await response.json();
  } catch (error) {
    // Registra um erro caso haja problemas com a solicitação
    console.error('Error fetching news:', error);
    
    // Retorna null em caso de erro
    return null;
  }
}

// Função para renderizar a seção de notícias em destaque
function renderFeaturedNewsSection(news) {
  // HTML da seção de notícias em destaque
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
  
  // Cria um novo elemento de seção
  const featuredNewsSection = document.createElement('section');
  
  // Define o conteúdo HTML da seção
  featuredNewsSection.innerHTML = featuredNewsSectionHTML;

  // Seleciona elementos dentro da seção
  const banner = featuredNewsSection.querySelector('.home-banner-image');
  const category = featuredNewsSection.querySelector('.category');
  const posted = featuredNewsSection.querySelector('.posted');
  const title = featuredNewsSection.querySelector('.featured-news-info-title');
  let indexPost = 0;
  let timer;

  // Seleciona todos os elementos de navegação
  const itemsNavigation = featuredNewsSection.querySelectorAll('.item-navigation');
  
  // Adiciona eventos de clique aos itens de navegação
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

  // Função para atualizar as notícias exibidas
  function updateNews() {
    if (!news) {
      category.textContent = '---';
      posted.textContent = '---';
      title.textContent = 'untitled';
      return;
    }

    banner.src = news[indexPost].banner;
    category.textContent = news[indexPost].category;
    posted.textContent = getTimeAgo(news[indexPost].updated_at);
    title.textContent = news[indexPost].title;
  }

  // Função para atualizar o índice da postagem exibida
  function updateIndexPost() {
    if (indexPost >= 2) {
      indexPost = 0;
    } else {
      indexPost++;
    }
  }

  // Função para atualizar a navegação
  function updateIndexNavigation() {
    itemsNavigation.forEach((item) => {
      item.checked = false;
    });
    itemsNavigation[indexPost].checked = true;
  }

  // Inicia a exibição inicial das notícias
  updateNews();
  
  // Atualiza a navegação
  updateIndexNavigation();

  // Configura o timer para troca automática de notícias
  timer = setInterval(() => {
    updateIndexPost();
    updateNews();
    updateIndexNavigation();
  }, 15000);

  // Retorna a seção de notícias em destaque
  return featuredNewsSection;
}

// Função para renderizar o feed de notícias
function renderNewsFeed(news) {
  // HTML do feed de notícias
  const newsFeedHTML = `
    <div class="news-feed-container">
      <h1 class="primary-heading">Notícias</h1>
      <div class="filters">
        <input class="filter" type="radio" id="interviews" name="category" value="interviews">
        <label class="checkbox" for="interviews">Entrevistas</label><br>
        <input class="filter" type="radio" id="reviews" name="category" value="reviews">
        <label class="checkbox" for="reviews">Reviews</label><br>
        <input class="filter" type="radio" id="stories" name="category" value="stories">
        <label class="checkbox" for="stories">Histórias</label><br>
        <input class="filter" type="radio" id="tips" name="category" value="tips">
        <label class="checkbox" for="tips">Dicas</label><br>
        <input class="filter" type="radio" id="trends" name="category" value="trends">
        <label class="checkbox" for="trends">Tendências</label><br>
      </div>
      <div class="news-feed-content"></div>
    </div>
  `;
  
  // Cria um novo elemento de seção
  const newsFeed = document.createElement('section');
  
  // Define o conteúdo HTML da seção
  newsFeed.innerHTML = newsFeedHTML;

  // Seleciona o conteúdo do feed de notícias
  const newsFeedContent = newsFeed.querySelector('.news-feed-content');

  // Seleciona todos os filtros
  const filters = newsFeed.querySelectorAll('.filter');
  
  // Adiciona eventos de clique aos filtros
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      // Obtém as notícias da categoria selecionada e renderiza
      getNewsFeed(filter.value).then(news => {
        renderNews(news.data);
      });
    });
  });

  // Objeto de funções para renderizar elementos
  const renders = {
    // Função para criar um cartão de notícia
    createCardNews: (post) => {
      const cardNews = document.createElement('div');
      cardNews.classList.add('card-news');
  
      const details = document.createElement('div');
      const info = document.createElement('div');
      info.classList.add('card-info');

      details.classList.add('details');
      const category = document.createElement('span');
      const datePost = document.createElement('span');
      const title = document.createElement('div');
      const image = document.createElement('img');

      category.textContent = post.category;
      category.classList.add('paragraph-normal');

      datePost.textContent = getTimeAgo(post.updated_at);
      datePost.classList.add('paragraph-normal');

      title.textContent = post.title;
      title.classList.add('paragraph-bold');

      image.classList.add('image');
      // image.src = post.banner;

      const numeroAleatorio = Math.floor(Math.random() * 100) + 1;
      image.src = `https://source.unsplash.com/random?a=${numeroAleatorio}`;


      details.appendChild(category);
      details.appendChild(datePost);

      info.appendChild(details);
      info.appendChild(title);

      cardNews.appendChild(info);
      cardNews.appendChild(image);
      setNavigation(cardNews, `/post/${post.id}`);

      return cardNews;
    },
    // Função para criar a estrutura de notícias
    createNews: (news) => {
      const defaultNewsFeedHTML = `
        <div class="category"></div>
      `;

      const defaultNewsFeed = document.createElement('div');
      defaultNewsFeed.innerHTML = defaultNewsFeedHTML;

      news.forEach((post) => {
        defaultNewsFeed.querySelector('div').appendChild(renders.createCardNews(post));
      });

      return defaultNewsFeed;
    }
  };

  // Função para renderizar as notícias
  function renderNews(news) {
    newsFeedContent.innerHTML = '';
    newsFeedContent.appendChild(renders.createNews(news));
  }

  // Renderiza as notícias
  renderNews(news);

  // Retorna o feed de notícias renderizado
  return newsFeed;
}

// Função home que exporta por padrão
export default function home() {
  // Função para criar o HTML do conteúdo da página inicial
  function createHomeContentHTML() {
    const homeContentHTML = `
      <main class="main main-home"></main>
    `;
    return homeContentHTML;
  }

  // Cria um elemento div para a página inicial
  const homeElement = document.createElement('div');
  homeElement.classList.add('home-container');
  homeElement.innerHTML = createHomeContentHTML();

  // Seleciona o elemento principal da página inicial
  const main = homeElement.querySelector(".main");

  // Insere o cabeçalho antes do elemento principal
  homeElement.insertBefore(header(), main);
  
  // Adiciona o rodapé ao final do elemento principal
  homeElement.append(footer());

  // Obtém notícias em destaque e renderiza a seção de notícias em destaque
  getFeaturedNews(3).then(news => {
    const featuredNewsSection = renderFeaturedNewsSection(news.data);
    const mainElement = homeElement.querySelector('.main-home');
    mainElement.appendChild(featuredNewsSection);
  });

  // Obtém o feed de notícias e renderiza o feed de notícias
  getNewsFeed().then(news => {
    const newsFeedSection = renderNewsFeed(news.data);
    main.appendChild(newsFeedSection);
  });

  // Retorna o elemento da página inicial
  return homeElement;
}
