
import setNavigation from "../../setNavigation.js";
import createCustomEvent from "../../eventModule.js";

function getUserData() {
  return fetch('/api/login/profile/')
    .then((response) => {
      if (!response.ok) {
        return response.json().then(errorResponse => {
          throw errorResponse;
        });
      }
      return response.json();
    })
    .then((data) => {
      console.log("get user: ", data);
      return data;
    })
    .catch((error) => {
      console.error('Erro:', error);
      throw error; // Propague o erro para quem chamar essa função
    });
}

function renderMenuOpened(user) {
  const menu = document.createElement('div');

  if (user) {
    const linkProfile = document.createElement('div');
    linkProfile.textContent = 'Perfil';
    setNavigation(linkProfile, "/profile"); 
    menu.appendChild(linkProfile);
  
    const linkDashboard = document.createElement('div');
    linkDashboard.textContent = 'Dashboard';
    setNavigation(linkDashboard, "/dashboard");
    menu.appendChild(linkDashboard);

    if (user.user_type == 'admin' || user.user_type == 'editor') {
      const linkPost = document.createElement('div');
      linkPost.textContent = 'Criar Post';
      setNavigation(linkPost, "/post");
      menu.appendChild(linkPost);
    }

    const linkFavorites = document.createElement('div');
    linkFavorites.textContent = 'Favoritos';
    setNavigation(linkFavorites, "/favorite");
    menu.appendChild(linkFavorites);

    if (user.user_type === 'admin') { 
      const linkAdmin = document.createElement('div');
      linkAdmin.textContent = 'Admin';
      setNavigation(linkAdmin, "/admin");
      menu.appendChild(linkAdmin);
    }

    const linkLogout = document.createElement('div');
    linkLogout.textContent = 'Logout';
    menu.appendChild(linkLogout);

    linkLogout.addEventListener('click', () => {
      fetch('/api/login/logout', {
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

  } else {
    // Se não houver dados de usuário, você pode adicionar algum comportamento alternativo
    console.log('Não há dados de usuário disponíveis.');
  }

  return menu;
}

export default function menu() {
  const menuContainer = document.createElement('div');
  menuContainer.classList.add('menu-container');

  const menuButtonIcon = document.createElement('img');
  menuButtonIcon.classList.add('menu-button-icon');
  menuButtonIcon.src = '/../../../../assets/images/menu.svg';

  const menuButton = document.createElement('div');
  menuButton.classList.add('menu-button');
  menuButton.appendChild(menuButtonIcon);

  menuContainer.appendChild(menuButton);

  menuButton.addEventListener('click', () => {
    toggleMenu();
  })

  function toggleMenu() {
    menuContainer.querySelector('.menu-opened').classList.toggle('hidden');
    menuContainer.querySelector('.menu-opened').classList.toggle('show');
  }

  getUserData()
    .then(user => {
      const menuOpened = renderMenuOpened(user);
      menuOpened.classList.add('menu-opened', 'hidden');
      menuContainer.appendChild(menuOpened);
    })
    .catch(error => {
      console.error('Erro ao carregar menu:', error);
      // Você pode adicionar um comportamento alternativo aqui se a carga do menu falhar
    });

  return menuContainer;
}