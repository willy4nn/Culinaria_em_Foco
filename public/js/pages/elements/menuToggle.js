import setNavigation from "../../setNavigation.js";
import createCustomEvent from "../../eventModule.js";

export default function menuButton() {
  const menuButton = document.createElement('div');
  menuButton.classList.add('menu-toggle');

  const menuButtonIcon = document.createElement('img');
  menuButtonIcon.src = '/../../../../assets/images/menu.svg'
  console.log(menuButtonIcon.src);

  const menu = document.createElement('div');

  const linkProfile = document.createElement('div');
  linkProfile.textContent = 'Perfil';
  setNavigation(linkProfile, "/profile")

  const linkPost = document.createElement('div');
  linkPost.textContent = 'Criar Post';
  setNavigation(linkPost, "/post")

  const linkFavorites = document.createElement('div');
  linkFavorites.textContent = 'Favoritos';
  setNavigation(linkFavorites, "/favorite")

  const linkDashboard = document.createElement('div');
  linkDashboard.textContent = 'Dashboard';
  setNavigation(linkDashboard, "/dashboard")

  const linkAdmin = document.createElement('div');
  linkAdmin.textContent = 'Admin';
  setNavigation(linkAdmin, "/admin")

  const logoutButton = document.createElement('div');
  logoutButton.textContent = 'Logout';
  logoutButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/api/login/logout`, {
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

  menuButton.addEventListener('click', () => {
    toggleMenu();
  });

  function toggleMenu() {
    console.log('Togando Menu');
  }
  
  menu.appendChild(linkProfile);
  menu.appendChild(linkPost);
  menu.appendChild(linkFavorites);
  menu.appendChild(linkDashboard);
  menu.appendChild(linkAdmin);
  menu.appendChild(logoutButton);
  menuButton.appendChild(menuButtonIcon);
  menuButton.appendChild(menu);

  return menuButton;
}