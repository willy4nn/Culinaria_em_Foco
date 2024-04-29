export default function header() {
  const header = document.createElement('header');
  header.classList.add('header');

  const divLogo = document.createElement('div');
  divLogo.classList.add('logo');
  
  const divLogoImg = document.createElement('img');
  divLogoImg.src= "./assets/images/croissant-logo.svg";
  divLogoImg.alt= "Logo Culinária em Foco";
  divLogo.appendChild(divLogoImg);

  const divLogoSpan = document.createElement('span');
  divLogoSpan.classList.add('paragraph-medium');
  divLogoSpan.textContent = 'Culinária em Foco';
  divLogo.appendChild(divLogoSpan);

  const divButtons = document.createElement('div');
  divButtons.classList.add('buttons');

  const buttonContact = document.createElement('a');
  buttonContact.classList.add('paragraph-medium');
  buttonContact.textContent = 'Contato';

  const buttonLogout = document.createElement('a');
  buttonLogout.classList.add("button");
  buttonLogout.classList.add("button-fill");
  buttonLogout.classList.add("logout");
  buttonLogout.textContent = 'Logout';

  if(document.location.pathname === "/home"){
    divButtons.appendChild(buttonLogout);
  }

  console.log(document.location.href)

  // Adiciona um ouvinte de eventos para o botão de logout
  buttonLogout.addEventListener('click', () => {
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
        window.location.assign("/")
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
  });

  header.appendChild(divLogo);
  header.appendChild(divButtons);

  return header;
}



  //pega o local atual da página
  // document.location.pathname