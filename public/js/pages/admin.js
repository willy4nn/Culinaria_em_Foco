// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import displayModal from '../utils/modal.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';
import setNavigation from '../setNavigation.js';

// Exporta a função principal que retorna a página principal
export default function admin() {
  // HTML do elemento principal
  const adminContentHTML = `
    <main class="main">
        <div id="container-header">
            <h1 class="primary-heading">Admin</h1>
        </div>
        <div class="admin-content">
          <table id="content-table">
            <tbody></tbody>
          </table>
        </div>
    </main>
  `;

  // Cria o elemento principal
  const adminElement = document.createElement('div');
  adminElement.classList.add('admin-container');
  adminElement.innerHTML = adminContentHTML;

  const containerAdmin = adminElement.querySelector('#container-admin');
  const contentTable = adminElement.querySelector('tbody');

  //Adiciona os elementos footer e header
  const main = adminElement.querySelector("main") 
  adminElement.insertBefore(header(), main)
  adminElement.append(footer())

  //Modal de erro
  const { popupCard, showPopup } = modalError();
  main.insertAdjacentElement("afterend", popupCard);

  getUsers();

  function renderUsersTable(data){

      data.forEach((item) => {

          const tableRow = document.createElement('tr');
          const id = document.createElement('td');
          const name = document.createElement('td');
          const username = document.createElement('td');
          const email = document.createElement('td');
          const userType = document.createElement('td');
          const status = document.createElement('td');
          const premiumActive = document.createElement('td');
          const premiumDate = document.createElement('td');
          const profilePhoto = document.createElement('td');
          const profilePhotoImg = document.createElement('img');
          const createdAt = document.createElement('td');
          const tdEdit = document.createElement('td');
          const tdDelete = document.createElement('td');
          const buttonEdit = document.createElement('button');
          const buttonConfirm = document.createElement('button');
          const buttonDelete = document.createElement('button');
          
          id.innerText = 'ID:' + item.id;
          name.innerText = item.name;
          username.innerText = item.username;
          email.innerText = item.email;
          userType.innerText = item.user_type.toUpperCase();
          status.innerText = `Status: ${item.status.toUpperCase()}`
          premiumActive.innerText = `Premium: ${item.premium_active}`
          premiumDate.innerText = `Expiração do Premium:
          ${dateFormat(item.premium_date)}`
          profilePhotoImg.src = item.profile_photo || '/assets/images/default_profile_normal.png';
          createdAt.innerText = `Conta Criada:
          ${dateFormat(item.created_at)}`
          
          profilePhotoImg.classList.add('admin-profile-image');
          buttonConfirm.style.display = 'none';
          buttonEdit.classList.add('table-button', 'button-fill');
          buttonConfirm.classList.add('table-button', 'button-fill');
          tdEdit.classList.add('group-table-button');
          buttonDelete.classList.add('table-button', 'button-delete');
  
          buttonEdit.innerHTML = 'Editar';
          buttonConfirm.innerHTML = 'Confirmar';
          buttonDelete.innerHTML = 'Deletar';
          
          profilePhoto.appendChild(profilePhotoImg);
          
          tdEdit.append(buttonEdit, buttonConfirm);
          tdDelete.appendChild(buttonDelete);

          tableRow.append(id, name, username, email, userType, status, premiumActive, 
            premiumDate, createdAt, tdEdit, tdDelete
          );
            
          contentTable.appendChild(tableRow);

          let editOpened = false;
          buttonEdit.addEventListener('click', () => {

            // Se já tiver aberto, fecha a edição
            if (editOpened) {
              [name, username, email, userType, status, premiumActive, premiumDate].forEach((element) => {
                element.classList.remove('editing');
              });
              [name, username, email, userType, status, premiumActive, premiumDate].forEach((element) => {
                const lastChild = element.lastChild;
                if (lastChild) {
                    element.removeChild(lastChild);
                }
              });
              editOpened = false;
              buttonEdit.innerText = 'Editar';
              buttonEdit.style.backgroundColor = '#FBBB50';
              buttonConfirm.style.display = 'none';
              return;
            }

            // Se não tiver aberto, abre e inicia a edição
            editOpened = true;
            buttonEdit.innerText = 'Cancelar';
            buttonEdit.style.backgroundColor = '#6b6b6b';
            
            buttonConfirm.style.display = 'block';

            [name, username, email, userType, status, premiumActive, premiumDate].forEach((element) => {
              element.classList.add('editing');
            })

            const inputName = document.createElement('input');
            const inputUsername = document.createElement('input');
            const inputEmail = document.createElement('input');
            const inputUserType = document.createElement('input');
            const inputStatus = document.createElement('input');
            const inputPremiumActive = document.createElement('input');
            const inputPremiumDate = document.createElement('input');

            [inputName, inputUsername, inputEmail, inputUserType, inputStatus, inputPremiumActive, inputPremiumDate].forEach((element) => {
              element.classList.add('edit-input');
            })

            inputPremiumDate.type = 'date';
            
            inputName.value = item.name;
            inputUsername.value = item.username;
            inputEmail.value = item.email;
            inputUserType.value = item.user_type;
            inputStatus.value = item.status;
            inputPremiumActive.value = item.premium_active;
            inputPremiumDate.value = item.premium_date.slice(0, 10); //dateFormat(item.premium_date);

            name.appendChild(inputName);
            username.appendChild(inputUsername);
            email.appendChild(inputEmail);
            userType.appendChild(inputUserType);
            status.appendChild(inputStatus);
            premiumActive.appendChild(inputPremiumActive);
            premiumDate.appendChild(inputPremiumDate);

            buttonConfirm.addEventListener('click', () => {
              const data = {
                name: inputName.value,
                username: inputUsername.value,
                email: inputEmail.value,
                user_type: inputUserType.value,
                status: inputStatus.value,
                premium_active: inputPremiumActive.value,
                premium_date: inputPremiumDate.value,
              }

              updateUser(item.username, data)
              .then(() => {
                contentTable.innerHTML = '';
                getUsers();
              })
              .catch(error => {
                showPopup(error, 'Erro!', false);
                console.error('Erro ao carregar dados página:', error);
              });
            })
          });
          
          buttonDelete.addEventListener('click', () => {
            const message = document.createElement('span');
            message.innerText = "Tem certeza que deseja excluir este usuário?"

            contentTable.appendChild(displayModal(message, async () => {
              deleteUser(item.id)
              .then((data) => {
                if (data.result.success) {
                  contentTable.innerHTML = '';
                  getUsers();
                  showPopup(data.result.message, 'Sucesso!', data.result.success);
                } else {
                  showPopup(data.result.message, 'Erro!', data.result.success);
                }
              })
            }));
          });
      });

  }

  function getUsers() {
    fetch(`/api/login/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Falha carregar dados do usuário');
      }
      return response.json();
    })
    .then((response) => {
      renderUsersTable(response);
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
  }

  // Retorna o elemento principal
  return adminElement;
}




async function updateUser(username, data) {
  fetch('/api/login/user/' + username, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(
              `Não foi possível atualiuzar o usuário! ${error.message}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        return;
      })
      .catch((err) => {
        console.error(err);
      });
}

async function deleteUser(id) {
  return fetch('/api/login/user/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(
              `Não foi possível deletar o usuário! ${error.message}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
}
