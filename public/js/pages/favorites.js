// favorite.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import getTimeAgo from '../utils/getTimeAgo.js';

function getFavoriteNews() {
  return fetch(`/api/favorite/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Falha ao carregar postagens');
    }
    return response.json();
  })
  .catch((error) => {
    console.error('Erro:', error);
    // Se ocorrer um erro, retornar null ou lançar um novo erro, dependendo do caso
    throw error;
  });
}

// Exporta a função principal que retorna a página principal
export default function favorites() {
  // HTML do elemento principal
  const favoriteContentHTML = `
    <main class="main">
        <h1 class="primary-heading">Favoritos</h1>
        <div class="favorites-content">

        </div>
      </div>
    </main>
  `;

  // Cria o elemento principal
  const favoriteElement = document.createElement('div');
  favoriteElement.classList.add('favorites-container');
  favoriteElement.innerHTML = favoriteContentHTML;

  // Adiciona os elementos footer e header
  const main = favoriteElement.querySelector("main") 
  favoriteElement.insertBefore(header(), main)
  favoriteElement.append(footer())

  const content = favoriteElement.querySelector('.favorites-content');

  getFavoriteNews().then(news => {
    renderNews(news.data); // Chama a função renderNews após obter os favoritos
  }).catch(error => {
    console.error('Erro ao obter favoritos:', error);
    // Lide com o erro adequadamente, por exemplo, exibindo uma mensagem de erro ao usuário
  });

  function renderNews(favorites){
    favorites.forEach((favorite) => {
      const container = document.createElement('div');
      container.classList.add('favorites-news-card');

      const title = document.createElement('p');
      title.classList.add('paragraph-bold');
      title.textContent = favorite.title;

      const category = document.createElement('p');
      category.classList.add('paragraph-normal');
      category.textContent = favorite.category

      const likes = document.createElement('p');
      likes.classList.add('paragraph-normal');
      likes.textContent = 'Curtidas: ' + favorite.likes_quantity

      const details = document.createElement('div');
      details.classList.add('details');

      const comments = document.createElement('p');
      comments.classList.add('paragraph-normal');
      comments.textContent = 'Comentários: ' + favorite.comments_quantity;

      const datePost = document.createElement('p');
      datePost.classList.add('paragraph-normal')
      datePost.textContent = getTimeAgo(favorite.updated_at)

      const interactions = document.createElement('div');
      interactions.classList.add('interactions');

      const banner = document.createElement('img');
      banner.classList.add('banner');
      banner.src = favorite.banner;

      details.appendChild(category);
      details.appendChild(datePost);

      interactions.appendChild(likes);
      interactions.appendChild(comments);
     
      container.appendChild(details);
      container.appendChild(title);
      container.appendChild(interactions);
      container.appendChild(banner);

      setNavigation(container, `/post/${favorite.id}`)

      content.appendChild(container);
    })
  }

  // Retorna o elemento principal
  return favoriteElement;
}
