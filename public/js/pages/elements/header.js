import createCustomEvent from "../../eventModule.js";
import setNavigation from "../../setNavigation.js";

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

function navigation() {
  function createLink(text, adress){
    const link = document.createElement('li');
    link.classList.add('link');
    link.textContent = text;

    setNavigation(link, adress);

    return link;
  }

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');

  const toggleButton = document.createElement('button');
  toggleButton.classList.add('toggle');

  const toggleButtonIcon = document.createElement('img');
  toggleButtonIcon.src = '../../../assets/images/menu.svg';

  const list = document.createElement('ul');
  list.classList.add('paragraph-medium','list');

  const links = [
    {
      text: 'Home',
      address: '/home'
    },
    {
      text: 'Perfil',
      address: '/profile'
    },
    {
      text: 'Postagens',
      address: '/dashboard'
    },
    {
      text: 'Favoritos',
      address: '/favorite'
    },
    {
      text: 'Usuários',
      address: '/admin'
    }
  ]

  const logoutButton = document.createElement('button');
  logoutButton.classList.add('button','button-fill','logout');
  logoutButton.textContent = 'Logout';

  const logoutButtonIcon = document.createElement('img');
  logoutButtonIcon.src = '../../../assets/images/signout.svg';

  toggleButton.addEventListener('click', () => {
    list.classList.toggle('show');
    document.body.classList.toggle('no-scroll');
  })

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
      console.log(data);
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
  });

  links.forEach((link) => {
    const item = createLink(link.text, link.address);
    item.classList.add('item');
    list.appendChild(item);
  })
  logoutButton.appendChild(logoutButtonIcon)
  toggleButton.appendChild(toggleButtonIcon);
  list.appendChild(logoutButton);
  navigation.appendChild(toggleButton);
  navigation.appendChild(list);

  return navigation;
}

export default function header() {
  const header = document.createElement('header');
  header.classList.add('header');

  const logoElement = logo();
  const navigationElement = navigation();

  setNavigation(logoElement, "/home")

  header.appendChild(logoElement);
  header.appendChild(navigationElement);

  return header;
}