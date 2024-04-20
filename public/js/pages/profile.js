import createCustomEvent from '../eventModule.js';

// Exporta a função que retorna a página de login
export default function profile() {
  // HTML do elemento de login
  const profileContentHTML = `
    <style>
      #profile-photo {
        border-radius: 50%;
        border-style: solid;
        max-width: 80px;
        border-color: darkgray;
      }

      #profile-username {
      }

      #profile-name {

      }
      
    </style>

    <header class="header">
      <div class="logo">
        <img src="./assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
        <span>Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-fill">Sign Up</a>
      </div>
    </header>
    <main class=""> 

      <div id="profile-container">
        <div id="profile-header">
          <img id="profile-photo"></img>
          <h1 id="profile-username">Username</h1>
          <p id="profile-name">Nome Sobrenome</p>
        </div>
        <div id="profile-content">
        </div>
      </div>

    </main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  const profileElement = document.createElement('div');
  profileElement.classList.add('profile-element');
  profileElement.innerHTML = profileContentHTML;

  const profilePhoto = profileElement.querySelector('#profile-photo');
  const profileUsername = profileElement.querySelector('#profile-username');
  const profileName = profileElement.querySelector('#profile-name');

  /* window.onload = async () => {
    try {
      // Aguardar a resolução de todas as operações assíncronas
      const [profileData] = await Promise.all([
        getUserData()
      ]);
  
      // Atualizar os elementos do perfil com os dados obtidos
      profileUsername.innerText = profileData.username || "none";
      profileName.innerText = profileData.name || "none";
  
    } catch (error) {
      console.error('Erro ao carregar dados do perfil do usuário:', error);
    }
  } */

  getUserData().then(profileData => {
    console.log("prof", profileData);
    profilePhoto.src = "https://styles.redditmedia.com/t5_48d08q/styles/profileIcon_d2d3lpc7x5v61.png?width=128&height=128&frame=1&auto=webp&crop=128:128,smart&s=b2c1c9ce9bfaf0242379c844ab186b3960865987";
    profileUsername.innerText = profileData.username || "none";
    profileName.innerText = profileData.name || "none";

  }).catch(error => {
    console.error('Erro ao carregar dados do perfil do usuário:', error);
  });
  

  return profileElement;
}



async function getUserData() {
  return fetch('http://localhost:3000/api/login/user/')
  .then((response) => {
      if (response.status !== 200) {
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
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}
