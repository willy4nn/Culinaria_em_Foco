// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import menuToggle from './elements/menuToggle.js';

// Exporta a função principal que retorna a página principal
export default function favorite() {
  // HTML do elemento principal
  const favoriteContentHTML = `

    <main>
      
      <div id="container-favorite">
        <div id="container-header">
            <h1>Favorites</h1>
        </div>
        <div id="favorite-content">
        </div>
      </div>

    </main>

  `;

  // Cria o elemento principal
  const favoriteElement = document.createElement('div');
  favoriteElement.innerHTML = favoriteContentHTML;

  //Adiciona os elementos footer e header
  const main = favoriteElement.querySelector("main") 
  favoriteElement.insertBefore(header(), main)
  favoriteElement.append(footer())
  favoriteElement.append(menuToggle())

  const containerFavorite = favoriteElement.querySelector('#container-favorite');
  const favoriteContent = favoriteElement.querySelector('#favorite-content');

  
  fetch(`/api/favorite/`, {
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
    // For apenas para testar a renderização com mais dados
    for(let i=0; i<10; i++) {

      data.forEach((item, index) => {
          console.log(item);
          const divContainer = document.createElement('div');
          const divDetails = document.createElement('div');
          const divBanner = document.createElement('div');
          
          const title = document.createElement('span');
          const category = document.createElement('span');
          const created_at = document.createElement('span');
          const commentsQuantity = document.createElement('span');
          const likesQuantity = document.createElement('span');

          //divBanner.style.backgroundImage = `linear-gradient(to right, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)), url(${item.banner})`;
          divBanner.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0) 43.75%, rgb(0, 0, 0) 100%), url(${item.banner})`;
          title.innerText = item.title;
          category.innerText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
          created_at.innerText = dateFormat(item.created_at);
          commentsQuantity.innerText = item.comments_quantity;
          likesQuantity.innerText = item.likes_quantity;

    
          divContainer.classList.add('favorite-item');
          divDetails.classList.add('favorite-detail');
          title.classList.add('favorite-tile');
          divBanner.classList.add('favorite-banner');

          divBanner.appendChild(title);
          divDetails.append(category, created_at, commentsQuantity, likesQuantity);
          divContainer.append(divBanner, divDetails);
          favoriteContent.appendChild(divContainer);

          setNavigation(divContainer, `/post/${item.id}`);
      });
    }
  }

  const logoutButton = favoriteElement.querySelector('.logout');
  logoutButton.addEventListener('click', () => {
    fetch(`/api/login/logout`, {
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
  return favoriteElement;
}
