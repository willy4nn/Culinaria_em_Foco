import setNavigation from "../../setNavigation.js";
import createCustomEvent from "../../eventModule.js";

export default function menuToggle() {
  const menuToggle = document.createElement('div');
  menuToggle.className = 'menu-toggle';
  menuToggle.id = 'menuToggle';
  menuToggle.textContent = '☰';

  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';

  const divButtons = document.createElement('div');
  divButtons.classList.add('buttons');
  
  const buttonProfile = document.createElement('a');
  buttonProfile.classList.add("button");
  buttonProfile.classList.add("button-fill");
  buttonProfile.textContent = "Perfil";
  setNavigation(buttonProfile, "/profile")

  const buttonPost = document.createElement('a');
  buttonPost.classList.add("button");
  buttonPost.classList.add("button-fill");
  buttonPost.textContent = "Postar";
  setNavigation(buttonPost, "/post")

  const buttonDashboard = document.createElement('a');
  buttonDashboard.classList.add("button");
  buttonDashboard.classList.add("button-fill");
  buttonDashboard.textContent = "Dashboard";
  setNavigation(buttonDashboard, "/dashboard")

  const buttonFavorite = document.createElement('a');
  buttonFavorite.classList.add("button");
  buttonFavorite.classList.add("button-fill");
  buttonFavorite.textContent = "Favoritos";
  setNavigation(buttonFavorite, "/favorite")
  
  const buttonAdmin = document.createElement('a');
  buttonAdmin.classList.add("button");
  buttonAdmin.classList.add("button-fill");
  buttonAdmin.textContent = "Administrador";
  setNavigation(buttonAdmin, "/admin")

  const buttonLogout = document.createElement('a');
  buttonLogout.classList.add("button");
  buttonLogout.classList.add("button-fill");
  buttonLogout.classList.add("logout");
  buttonLogout.textContent = 'Logout';

  // Adiciona um ouvinte de eventos para o botão de logout
  buttonLogout.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/login/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha no logout');
        }
        
        window.dispatchEvent(createCustomEvent('/'));
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
  });

  sidebar.appendChild(buttonProfile)
  sidebar.appendChild(buttonDashboard)
  sidebar.appendChild(buttonFavorite)
  sidebar.appendChild(buttonAdmin)
  sidebar.appendChild(buttonProfile)
  sidebar.appendChild(buttonLogout)

  //sidebar.appendChild(divButtons);

  menuToggle.appendChild(sidebar);

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
  });
  
  return menuToggle;
}