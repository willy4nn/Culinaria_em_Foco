// Importa os módulos necessários
import getTimeAgo from "../utils/getTimeAgo.js";
import createCustomEvent from '../eventModule.js';
import footer from './elements/footer.js'
import header from './elements/header.js'
import menuToggle from './elements/menuToggle.js';

async function getFeaturedNews(limit) {
  let url = limit ? `http://localhost:3000/api/posts/like?limit=${limit}` : `http://localhost:3000/api/posts/like?limit=1`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured news');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return null;
  }
}

async function getNewsFeed(category) {
  let url = category ? `http://localhost:3000/api/posts/category/${category}` : `http://localhost:3000/api/posts/all`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
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
      <div class="filters">
        <label class="checkbox">
          Latest News
          <input class="filter" type="radio" name="category" value="latest_news">
        </label>
        <label class="checkbox">
          Tips
          <input class="filter" type="radio" name="category" value="tips">
        </label>
        <label class="checkbox">
          Stories
          <input class="filter" type="radio" name="category" value="stories">
        </label>
        <label class="checkbox">
          Tendencies
          <input class="filter" type="radio" name="category" value="tendencies">
        </label>
        <label class="checkbox">
          Interviews
          <input class="filter" type="radio" name="category" value="interviews">
        </label>
      </div>
      <div class="news-feed-content">

      </div>
    </div>
  `

  const newsFeed = document.createElement('section');
  newsFeed.innerHTML = newsFeedHTML;

  const newsFeedContent = newsFeed.querySelector('.news-feed-content');

  const filters = newsFeed.querySelectorAll('.filter');
  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      getNewsFeed(filter.value).then(news => {
        console.log(news);
        console.log(filter.value);
        renderNews(filter.value, news);
      });
    })
  })

  const renders = {
    createCardNews : (post) => {
      const cardNews = document.createElement('div');
      const details = document.createElement('div');
      const category = document.createElement('span');
      const datePost = document.createElement('span');
      const title = document.createElement('div');

      category.textContent = post.category;
      datePost.textContent = post.updated_at;
      title.textContent = post.title;

      details.appendChild(category);
      details.appendChild(datePost);
      cardNews.appendChild(details);
      cardNews.appendChild(title);

      return cardNews;
    },
    default : (news) => {
      const defaultNewsFeedHTML = `
        <div>
        <div class="column column-1"></div>
        <div class="column column-2"></div>
        <div class="column column-3"></div>
        </div>
      `

      const defaultNewsFeed = document.createElement('div');
      defaultNewsFeed.innerHTML = defaultNewsFeedHTML;

      const firstColumn = defaultNewsFeed.querySelector('.column-1');
      const secondColumn = defaultNewsFeed.querySelector('.column-2');
      const thirdColumn = defaultNewsFeed.querySelector('.column-3');

      news.forEach((post, index) => {

        if (index <= 5) {
          firstColumn.appendChild(renders.createCardNews(post));
        } else if (index = 6) {
          secondColumn.appendChild(renders.createCardNews(post));
        } else if (index > 6 && index <= 9) {
          thirdColumn.appendChild(renders.createCardNews(post));
        }
      })

      return defaultNewsFeed;
    },
    category : (news) => {
      console.log('Teste:', news);
      const defaultNewsFeedHTML = `
        <div>

        </div>
      `

      const defaultNewsFeed = document.createElement('div');
      defaultNewsFeed.innerHTML = defaultNewsFeedHTML;


      news.forEach((post, index) => {
        defaultNewsFeed.querySelector('div').appendChild(renders.createCardNews(post));
      })

      return defaultNewsFeed;
    }
  }

  function renderNews(filter, news){
    newsFeedContent.innerHTML = '';
    if (!filter) {
      newsFeedContent.appendChild(renders.default(news));
      return;
    }
    newsFeedContent.appendChild(renders.category(news.data));

  }
  renderNews(null, news);

  return newsFeed;
}

// Função principal que renderiza a página inicial
export default function home() {
  // HTML do conteúdo da página inicial
  function createHomeContentHTML() {
    const homeContentHTML = `
    <main class="main main-home">

    </main>
  `;
    return homeContentHTML;
  }

  // Cria um elemento div para a página inicial
  const homeElement = document.createElement('div');
  homeElement.classList.add('home-container');
  homeElement.innerHTML = createHomeContentHTML();

  const main = homeElement.querySelector("main") 

  homeElement.insertBefore(header(), main)
  homeElement.append(footer())
  homeElement.append(menuToggle())

  // Chama a função getFeaturedNews() para obter as notícias em destaque
  getFeaturedNews(3).then(news => {
    // Renderiza a seção de notícias em destaque
    const featuredNewsSection = renderFeaturedNewsSection(news.data);
    // Adiciona a seção de notícias em destaque ao elemento principal da página inicial
    const mainElement = homeElement.querySelector('.main-home');
    mainElement.appendChild(featuredNewsSection);
  });

  getNewsFeed().then(news => {
    // Renderiza a seção de notícias em destaque
    const newsFeedSection = renderNewsFeed(news.data);
    // Adiciona a seção de notícias em destaque ao elemento principal da página inicial
    const mainElement = homeElement.querySelector('.main-home');
    mainElement.appendChild(newsFeedSection);
  });

  // Retorna o elemento da página inicial
  return homeElement;
}
