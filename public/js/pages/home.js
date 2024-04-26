    // Importa a função createCustomEvent do módulo de eventos
    import createCustomEvent from '../eventModule.js';
    import setNavigation from '../setNavigation.js';

    // Exporta a função principal que retorna a página principal
    export default function home() {
      // HTML do elemento principal
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

      // Cria o elemento principal
      const homeElement = document.createElement('div');
      homeElement.classList.add('home-container');
      homeElement.innerHTML = homeContentHTML;

      // Seleciona o conteúdo das notícias em destaque
      const featuredNewsContent = homeElement.querySelector('.featured-news-content');

      // Requisição para obter as notícias em destaque
      fetch('http://localhost:3000/api/posts/like?limit=3')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText); // Mensagem de erro mais descritiva
          }
          return response.json();
        })
        .then((data) => {
          featuredNewsContent.appendChild(renderCarousel(data.data));
        })
        .catch(error => console.error('Erro:', error)); // Tratamento de erro na requisição

      // Evento de logout
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

      // Retorna o elemento principal
      return homeElement;
    }


    function renderCarousel(posts) {
      console.log(posts);
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
                <span class="posted"></span:
              </div>
              <p class="featured-news-info-title"></p>
            </div>
          </div>
      `
      const carouselElement = document.createElement('div');
      carouselElement.classList.add('carousel-container');
      carouselElement.innerHTML = carouselElementHTML;

      const bannerImage = carouselElement.querySelector('.featured-news-banner-image');

      const category = carouselElement.querySelector('.category');
      const posted = carouselElement.querySelector('.posted');
      const title = carouselElement.querySelector('.featured-news-info-title');

      const elements = {
        bannerImage,
        category,
        posted,
        title
      }
      
      const itemsNavigation = carouselElement.querySelectorAll('.item-navigation');
      itemsNavigation.forEach((item, index) => {
        item.addEventListener('click', () => {
          updateFeaturedNews(index, elements);
        });
      })

      function updateFeaturedNews(index, elements) {
        console.log(posts);
        elements.bannerImage.src = posts[index].banner;
        elements.category.innerHTML = posts[index].category;
        elements.posted.innerHTML = posts[index].updated_at;
        elements.title.innerHTML = posts[index].title;
      }

      return carouselElement;
    }
