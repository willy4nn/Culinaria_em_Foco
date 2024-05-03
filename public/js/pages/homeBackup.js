// Importa os módulos necessários
import getTimeAgo from "../utils/getTimeAgo.js";

function getFeaturedNews() {
  return fetch('/api/posts/like?limit=3')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch featured news');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching featured news:', error);
      return null;
    });
}

function getNewsFeed() {
return fetch('/api/posts/all')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch featured news');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error fetching featured news:', error);
    return null;
  });
}

function renderFeaturedNewsSection(news) {
  const featuredNewsSectionHTML = `
    <div class="featured-news-container">
      <h1 class="primary-heading">Featured News</h1>
      <div class="featured-news-content">
        <div class="carousel-container">
          <div class="banner-container">
            <div class="banner">
              <img class="banner-image">
            </div>
            <div class="featured-news-navigation">
              <input class="item-navigation" type="radio" name="page">
              <input class="item-navigation" type="radio" name="page">
              <input class="item-navigation" type="radio" name="page">
            </div>
          </div>
          <div class="featured-news-info">
            <div class="featured-news-details">
              <p class="category"></p>
              <span class="divider"></span>
              <p class="posted"></p>
            </div>
            <p class="featured-news-info-title paragraph-medium"></p>
          </div>
        </div>
      </div>
    </div>
  `
  const featuredNewsSection = document.createElement('section');
  featuredNewsSection.innerHTML = featuredNewsSectionHTML;

  const banner = featuredNewsSection.querySelector('.banner-image');
  const category = featuredNewsSection.querySelector('.category');
  const posted = featuredNewsSection.querySelector('.posted');
  const title = featuredNewsSection.querySelector('.featured-news-info-title');
  let indexPost = 0;
  let timer;

  const itemsNavigation = featuredNewsSection.querySelectorAll('.item-navigation');
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
    })
  })

  function updateNews() {
    if(!news) {
      category.textContent = '---';
      posted.textContent = '---';
      title.textContent = 'untitled'
      return;
    }
    banner.src = news[indexPost].banner;
    console.log(news[0]);
    category.textContent = news[indexPost].category;
    posted.textContent = getTimeAgo(news[indexPost].updated_at);
    title.textContent = news[indexPost].title;
  }

  function updateIndexPost() {
    if (indexPost >= 2) {
      indexPost = 0;
    } else {
      indexPost++;
    }
  }

  function updateIndexNavigation() {
    itemsNavigation.forEach((item) => {
      item.checked = false;
    })
    itemsNavigation[indexPost].checked = true;
  }

  updateNews();
  updateIndexNavigation();

  timer = setInterval(() => {
    updateIndexPost();
    updateNews();
    updateIndexNavigation();
  }, 15000);

  return featuredNewsSection;
}

function renderNewsFeed(news) {
  const newsFeedHTML = `
    <div class="news-feed-container">
      <h1 class="primary-heading">News Feed</h1>
      <div class="news-feed-content">

      </div>
    </div>
  `

  // console.log('📢 NOTÍCIAS DO FEED:', news);

  const newsFeed = document.createElement('section');
  newsFeed.innerHTML = newsFeedHTML;

  const newsFeedContent = newsFeed.querySelector('.news-feed-content');

  if (!news) {
    console.log('Não há notícias');
  } else {
    news.forEach((post, index) => {
      console.log(`[📢] [${index}] # POSTAGEM : `, post);
    });
  }

  return newsFeed;
}

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

    </main>
    <footer class="footer footer-home">
        <p class="paragraph-medium">© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  // Cria um elemento div para a página inicial
  const homeElement = document.createElement('div');
  homeElement.classList.add('home-container');
  homeElement.innerHTML = homeContentHTML;

  // Chama a função getFeaturedNews() para obter as notícias em destaque
  getFeaturedNews().then(news => {
    // Verifica se há notícias antes de renderizar
    if (!news) {
      renderFeaturedNewsSection();
      return;
    }
    // Renderiza a seção de notícias em destaque
    const featuredNewsSection = renderFeaturedNewsSection(news.data);
    // Adiciona a seção de notícias em destaque ao elemento principal da página inicial
    const mainElement = homeElement.querySelector('.main-home');
    mainElement.appendChild(featuredNewsSection);
  });

  getNewsFeed().then(news => {
    // Verifica se há notícias antes de renderizar
    if (!news) {
      renderNewsFeed();
      return;
    }
    // Renderiza a seção de notícias em destaque
    const newsFeedSection = renderNewsFeed(news.data);
    // Adiciona a seção de notícias em destaque ao elemento principal da página inicial
    const mainElement = homeElement.querySelector('.main-home');
    mainElement.appendChild(newsFeedSection);
  });

  // Retorna o elemento da página inicial
  return homeElement;
}
