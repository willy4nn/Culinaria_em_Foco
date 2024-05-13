// header.js

// Importações necessárias
import createCustomEvent from "../../eventModule.js";
import setNavigation from "../../setNavigation.js";
import getUserData from "../../utils/getUserData.js";

// Função que cria a logo do header
function logo() {
  const logo = document.createElement('div');
  logo.classList.add('logo');
  
  const logoIcon = document.createElement('img');
  logoIcon.classList.add('logo-icon')
  logoIcon.src= "/assets/images/croissant-logo.svg";
  logoIcon.alt= "Logo Culinária em Foco";
  logo.appendChild(logoIcon);

  const logoTitle = document.createElement('span');
  logoTitle.classList.add('paragraph-medium');
  logoTitle.textContent = 'Culinária em Foco';
  logo.appendChild(logoTitle);

  return logo;
}

// Função que cria a navegação do header
function navigation(user) {
  // Função que cria links navegáveis
  function createLink(text, adress){
    // Cria link
    const link = document.createElement('li');
    link.classList.add('link');
    link.textContent = text;
  
    // Adiciona navegação ao link
    setNavigation(link, adress);
  
    // Retorna o link
    return link;
  }

  // Cria o elemento da navegação
  const navigation = document.createElement('div');
  navigation.classList.add('navigation');

  // Cria o botão do menu de navegação
  const toggleButton = document.createElement('button');
  toggleButton.classList.add('toggle');

  // Cria o ícone do botão do menu de navegação
  const toggleButtonIcon = document.createElement('img');
  toggleButtonIcon.src = '../../../assets/images/menu.svg';

  // Cria a lista dos links de navegação
  const list = document.createElement('ul');
  list.classList.add('paragraph-medium','list');

  // Guarda as informações e permissões de cada link em uma array
  const links = [
    {
      user: 'user',
      text: 'Home',
      address: '/home'
    },
    {
      user: 'user',
      text: 'Perfil',
      address: '/profile'
    },
    {
      user: 'user',
      text: 'Favoritos',
      address: '/favorites'
    },
    {
      user: 'editor',
      text: 'Postagens',
      address: '/dashboard'
    },
    {
      user: 'editor',
      text: 'Postar',
      address: '/create'
    },
    {
      user: 'admin',
      text: 'Admin',
      address: '/admin'
    },
  ]

  // Cria o botão de deslogar
  const logoutButton = document.createElement('button');
  logoutButton.classList.add('button','button-fill','logout');
  logoutButton.textContent = 'Logout';

  // Cria o ícone do botão de deslogar
  const logoutButtonIcon = document.createElement('img');
  logoutButtonIcon.src = '../../../assets/images/signout.svg';

const overlay = document.createElement('div');
overlay.classList.add('overlay');

navigation.appendChild(overlay);

// Adiciona a ação de abrir e fechar ao clicar no botão do menu de navegação
toggleButton.addEventListener('click', () => {
  list.classList.toggle('show');
  overlay.classList.toggle('blur');
  document.body.classList.toggle('no-scroll');
});

navigation.addEventListener('click', (e) => {
  if (e.target !== list && e.target !== toggleButton && e.target !== toggleButtonIcon) {
    document.body.classList.toggle('no-scroll');
    list.classList.toggle('show');
    overlay.classList.toggle('blur');
  }
})

  // Adiciona a ação de deslogar ao clicar no botão de deslogar
  logoutButton.addEventListener('click', () => {
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
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
  });

  // Adiciona à lista de naveção todos os links baseado no tipo de usuário
  links
  .filter(link => {
    if (user.user_type === "user" && link.user !== "user") return false;
    if (user.user_type === "editor" && (link.user !== "user" && link.user !== "editor")) return false;
    return true;
  })
  .forEach(link => {
    const item = createLink(link.text, link.address);
    item.classList.add('item');
    list.appendChild(item);
  });

  // Adiciona o ícone ao menu de navegação
  toggleButton.appendChild(toggleButtonIcon);

  // Adiciona o ícone ao botão de deslogar
  logoutButton.appendChild(logoutButtonIcon)

  // Adiciona o botão de deslogar à lista de naveção
  list.appendChild(logoutButton);

  // Adiciona o botão do menu de navagação ao elemento da navegação
  navigation.appendChild(toggleButton);

  // Adiciona a lista de links de navegação ao elemento da navegação
  navigation.appendChild(list);

  // Retorna o elemento da navegação
  return navigation;
}

// Função que cria o header
export default function header() {
  // Cria o elemento do header
  const header = document.createElement('header');
  header.classList.add('header');

  // Cria o elemento da logo
  const logoElement = logo();

  // Adiciona ao header o elemento da logo
  header.appendChild(logoElement);

  // Adiciona a navegação à logo
  setNavigation(logoElement, "/home")
  
  // Obtém os dados do usuários para adicionar a navegação ao header
  getUserData()
  .then(userInfo => {
    const navigationElement = navigation(userInfo);
    header.appendChild(navigationElement);
  })
  .catch(error => {
    console.error('Erro ao carregar menu:', error);
  });

  // Retorna o elemento do header
  return header;
}