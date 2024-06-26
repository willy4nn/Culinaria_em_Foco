import createCustomEvent from '../eventModule.js';
import { importLocalFile } from '../utils/upload_file/upload_files.js';
import { animationClick } from '../utils/animation.js';
import { renewDate } from '../utils/dateFormat.js';
import displayModal from '../utils/modal.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';

//Modal de erro
const { popupCard, showPopup } = modalError();

// Exporta a função que retorna a página de login
export default function profile() {
  // HTML do elemento de login
  const profileContentHTML = `
    <main class="main"> 
      <div class="profile-card">
        <div id="profile-header" class="profile-header">
          <img id="profile-photo" class="my-profile-photo"></img>
          <h1 id="profile-name" class="profile-name paragraph-bold">Nome Sobrenome</h1>
          <p id="profile-username" class="profile-username paragraph-medium">Username</p>
        </div>
        <div id="profile-wrapper" class="wrapper">
          <div id="profile-content" class="profile-content">
            <div class="profile-group">
              <span class="label paragraph-normal">E-mail</span>
              <span id="profile-email" class="paragraph-normal"></span>
            </div>
            <div class="profile-group">
              <span class="label paragraph-normal">Tipo de usuário</span>
              <span id="profile-user-type" class="paragraph-normal"></span>
            </div>
            <div class="profile-group">
              <span class="label paragraph-normal">Premium</span>
              <span id="profile-premium-active" class="paragraph-normal"></span>
            </div>
            <div class="profile-group">
              <span class="label paragraph-normal">Renovação da assinatura</span>
              <span id="profile-premium-date" class="paragraph-normal"></span>
            </div>
          </div>
          <div id="profile-edit" class="profile-content">
            <div class="profile-group">
              <span class="label-edit">Nome</span>
              <input id="name-input" placeholder="Nome"></input>
            </div>
            <div class="profile-group">
              <span class="label-edit">Username</span>
              <input id="username-input" placeholder="Username"></input>
            </div>
            <div class="profile-group">
              <span class="label-edit">E-mail</span>
              <input id="email-input" placeholder="E-mail"></input>
            </div>
            <div class="profile-group">
              <span class="label-edit">Senha</span>
              <input id="first-password-input" placeholder="Nova senha" type="password"></input>
              <input id="second-password-input" placeholder="Repita a nova senha" type="password"></input>
            </div>
            <div class="profile-group">
              <span class="label-edit">Informe a senha atual para confirmar as alterações*</span>
              <input id="current-password-input" placeholder="Senha atual" type="password"></input>
            </div>
          </div>
          <div id="profile-options" class="profile-options">
            <div class="options-group">
              <button id="edit-button" class="edit-button">Editar Perfil</button>
              <button id="favorite-button">Favoritos</button>
              <button id="premium-button">Assinar Premium</button>
            </div>
          </div>
          <div id="edit-options">
            <div class="options-group">
              <button id="cancel-button">Cancelar</button>
              <button id="confirm-button">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  const profileElement = document.createElement('div');
  profileElement.classList.add('profile-container');
  profileElement.innerHTML = profileContentHTML;

  //Adiciona os elementos footer e header
  const main = profileElement.querySelector("main") 
  profileElement.insertBefore(header(), main)
  profileElement.append(footer())

  //Modal de erro
  main.insertAdjacentElement("afterend", popupCard);

  const profileContent = profileElement.querySelector('#profile-content');
  const profilePhoto = profileElement.querySelector('#profile-photo');
  const profileUsername = profileElement.querySelector('#profile-username');
  const profileName = profileElement.querySelector('#profile-name');

  const profileWrapper = profileElement.querySelector('#profile-wrapper');
  const profileEmail = profileElement.querySelector('#profile-email');
  const profileUserType = profileElement.querySelector('#profile-user-type');
  const profilePremiumActive = profileElement.querySelector('#profile-premium-active');
  const profilePremiumDate = profileElement.querySelector('#profile-premium-date');

  const editButton = profileElement.querySelector('#edit-button');
  const favoriteButton = profileElement.querySelector('#favorite-button');
  const premiumButton = profileElement.querySelector('#premium-button');

  const profileOptions = profileElement.querySelector('#profile-options');
  const profileEdit = profileElement.querySelector('#profile-edit');
  const editOptions = profileElement.querySelector('#edit-options');

  const nameInput = profileElement.querySelector('#name-input');
  const usernameInput = profileElement.querySelector('#username-input');
  const emailInput = profileElement.querySelector('#email-input');
  const firstPasswordInput = profileElement.querySelector('#first-password-input');
  const secondPasswordInput = profileElement.querySelector('#second-password-input');
  const currentPasswordInput = profileElement.querySelector('#current-password-input');

  const cancelButton = profileElement.querySelector('#cancel-button');
  const confirmButton = profileElement.querySelector('#confirm-button');

  (function loadProfile() {
  
    getUserData().then(profileData => {
      profilePhoto.src = profileData.profile_photo || "/assets/images/default_profile_normal.png";
      profileUsername.innerText = `@${profileData.username}` || "@none";
      profileName.innerText = profileData.name || "none";
  
      profileEmail.innerText = profileData.email;
      profileUserType.innerText = profileData.user_type;
      profilePremiumActive.innerText = profileData.premium_active ? 'Ativo' : 'Sem assinatura';
      profilePremiumDate.innerText = renewDate(profileData.premium_date);
  
      profileUserType.style.textTransform = 'capitalize';
      
      // Atualizar foto
      profilePhoto.addEventListener('click', () => {
        animationClick(profilePhoto);
      
        const inputPhoto = document.createElement('input');
        inputPhoto.type = 'file';
        inputPhoto.name = 'files';
        inputPhoto.value = '';
        inputPhoto.click();

        const photoPreview = document.createElement('img');
        photoPreview.classList.add('my-profile-photo');

        inputPhoto.addEventListener('change', (e) => {
          const file = e.target.files[0];
      
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            photoPreview.src = imageUrl;

            profileContent.appendChild(displayModal(photoPreview, async () => {
              updatePhoto(inputPhoto.files[0])
              .then((data) => {
              })}
            )); 
          }
        });
      });

      favoriteButton.addEventListener('click', () => {
        animationClick(favoriteButton);
        window.dispatchEvent(createCustomEvent('/favorites'));
      });

      premiumButton.addEventListener('click', () => {
        animationClick(premiumButton);
        window.dispatchEvent(createCustomEvent('/editor')); // Teste
      });

      editButton.addEventListener('click', () => {
        animationClick(editButton);
        nameInput.value = profileData.name;
        usernameInput.value = profileData.username;
        emailInput.value = profileData.email;
        
    
        profileContent.style.display = 'none';
        profileEdit.style.display = 'flex';
        profileOptions.style.display = 'none';
        editOptions.style.display = 'flex';
      });

      cancelButton.addEventListener('click', () => {
        animationClick(cancelButton);
        profileEdit.style.display = 'none';
        profileContent.style.display = 'flex';
        editOptions.style.display = 'none';
        profileOptions.style.display = 'flex';

        firstPasswordInput.value = '';
        secondPasswordInput.value = '';
        currentPasswordInput.value = '';
      });
    
      confirmButton.addEventListener('click', async () => {
        animationClick(confirmButton);

        const data = {
          name: nameInput.value,
          username: usernameInput.value,
          email: emailInput.value,
          firstPassword: firstPasswordInput.value,
          secondPassword: secondPasswordInput.value,
          currentPassword: currentPasswordInput.value,
        }
    
        const erro = validateForm(data);
    
        if (erro) {
          showPopup(erro);
          return
        }

        //Aqui verifica se usuário digitou a senha correta
        const verify = await fetch(`/api/login/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: emailInput.value,
            password: currentPasswordInput.value 
          }),
        })
        .then((response) => {
          if (!response.ok){
            return { success: false, message: "Senha Incorreta" }
          }
          return { success: true }
        })
        
        if(!verify.success){
          showPopup(verify.message)
          return
        }

          const newData = formatPasswordData(data);
          updateUser(profileData.username, newData)
          .then((data) => {
            if(data) loadProfile();
            profileEdit.style.display = 'none';
            profileContent.style.display = 'flex';
            editOptions.style.display = 'none';
            profileOptions.style.display = 'flex';
          })
        }
      );

      // Upload da foto de perfil
      async function updatePhoto(file){
        const photoURI = await importLocalFile(file, 'photo');

        if (photoURI) {
          const data = {
            profile_photo: photoURI
          }

          updateUser(profileData.username, data)
          .then((data) => {
            if (data) profilePhoto.src = photoURI;
          })
          .catch(error => {
            showPopup(error);
            console.error('Erro ao atualizar foto:', error);
          });

        } else {
          showPopup("Erro ao fazer upload da foto")
          console.error("Erro ao fazer upload da foto");
        }
      };

    }).catch(error => {
      showPopup(error)
      console.error('Erro ao carregar dados do perfil do usuário:', error);
    });
  })();
  
  return profileElement;
}

async function getUserData() {
  return fetch('/api/login/profile/')
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      return data;
  })
  .catch((error) => {
    showPopup(error.error)
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function updateUser(username, data) {
  return fetch('/api/login/user/' + username, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.message
        }
        return response.json();
      })
      .then((data) => {
        showPopup(data.message, "Sucesso!")
        return data;
      })
      .catch((err) => {
        showPopup(err)
        console.error(err);
      });
}

function validateForm(form){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (form.name.trim() === '') return 'O Nome não pode ser nulo';
  if (form.username.trim() === '') return 'O Username não pode ser nulo';
  if (form.email.trim() === '') return 'O E-mail não pode ser nulo';
  if (!emailRegex.test(form.email.trim())) return 'Informe um e-mail válido';
  if (form.currentPassword.trim() === '') return 'Informe a senha atual para confirmar as alterações';
  if (form.firstPassword.trim() !== form.secondPassword.trim()) return 'As senhas são diferentes';
  if (form.firstPassword.trim().length < 8 || form.secondPassword.trim() < 8) {
    if (!(form.firstPassword.trim() === '' && form.secondPassword.trim() === '' )) {
      return 'A senha precisa ter no mínimo 8 caracteres';
    }
  }
}

function formatPasswordData(form) {
  if (form.firstPassword.trim() === '' && form.secondPassword.trim() === '' ) {
    const data = {
      name: form.name,
      username: form.username,
      email: form.email,
    }
    return data;
  } else {
    const data = {
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.firstPassword,
      password2: form.secondPassword
    }
    return data;
  }
}