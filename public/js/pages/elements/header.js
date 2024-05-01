import setNavigation from "../../setNavigation.js";

export default function header() {
  const header = document.createElement('header');
  header.classList.add('header');

  const divLogo = document.createElement('div');
  divLogo.classList.add('logo');
  
  const divLogoImg = document.createElement('img');
  divLogoImg.classList.add('logo-image')
  divLogoImg.src= "./assets/images/croissant-logo.svg";
  divLogoImg.alt= "Logo Culinária em Foco";
  divLogo.appendChild(divLogoImg);

  console.log(divLogoImg.src);

  const divLogoSpan = document.createElement('span');
  divLogoSpan.classList.add('paragraph-medium');
  divLogoSpan.textContent = 'Culinária em Foco';
  divLogo.appendChild(divLogoSpan);

  setNavigation(divLogoImg, "/home")

  // const divButtons = document.createElement('div');
  // divButtons.classList.add('buttons');

  // const buttonContact = document.createElement('a');
  // buttonContact.classList.add('paragraph-medium');
  // buttonContact.textContent = 'Contato';

  header.appendChild(divLogo);
  //header.appendChild(divButtons);

  return header;
}



  //pega o local atual da página
  // document.location.pathname