// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import displayModal from '../utils/modal.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import menuToggle from './elements/menuToggle.js';

// Exporta a função principal que retorna a página principal
export default function admin() {
  // HTML do elemento principal
  const adminContentHTML = `

    <main>
      
      <div id="container-admin">

        <div id="container-header">
            <h1>Administrator</h1>
        </div>

        <div id="admin-content">
        <div class="table-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Username</th>
                <th>E-mail At</th>
                <th>User Type</th>
                <th>Premium Active</th>
                <th>Premium Date</th>
                <th>Profile Photo</th>
                <!-- <th>Session Token</th> -->
                <th>Created At</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-content">
          <table id="content-table">
          </table>
        </div>

      </div>
    </main>
  `;

  // Cria o elemento principal
  const adminElement = document.createElement('div');
  adminElement.innerHTML = adminContentHTML;

  const containerAdmin = adminElement.querySelector('#container-admin');
  const contentTable = adminElement.querySelector('#content-table');

  //Adiciona os elementos footer e header
  const main = adminElement.querySelector("main") 
  adminElement.insertBefore(header(), main)
  adminElement.append(footer())
  adminElement.append(menuToggle())

  getUsers();

  function renderUsersTable(data){

      data.forEach((item) => {
        
          console.log(item);
          const tableRow = document.createElement('tr');
          const id = document.createElement('td');
          const name = document.createElement('td');
          const username = document.createElement('td');
          const email = document.createElement('td');
          const userType = document.createElement('td');
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

          id.innerText = item.id;
          name.innerText = item.name;
          username.innerText = item.username;
          email.innerText = item.email;
          userType.innerText = item.user_type.toUpperCase();
          premiumActive.innerText = item.premium_active;
          premiumDate.innerText = dateFormat(item.premium_date);
          profilePhotoImg.src = item.profile_photo || '/assets/images/default_profile_normal.png';
          createdAt.innerText = dateFormat(item.created_at);
          buttonEdit.innerText = 'Edit';
          buttonConfirm.innerText = 'Confirm';
          buttonDelete.innerText = 'Delete';

          profilePhotoImg.classList.add('admin-profile-image');
          buttonConfirm.style.display = 'none';

          profilePhoto.appendChild(profilePhotoImg);
          tdEdit.append(buttonEdit, buttonConfirm);
          tdDelete.appendChild(buttonDelete);

          tableRow.append(id, name, username, email, userType, premiumActive, 
            premiumDate, profilePhoto, createdAt, tdEdit, tdDelete
          );
            
          contentTable.appendChild(tableRow);

          buttonEdit.addEventListener('click', () => {
            buttonConfirm.style.display = 'block';

            [name, username, email, userType, premiumActive, premiumDate].forEach((element) => {
              element.classList.add('editing');
            })

            const inputName = document.createElement('input');
            const inputUsername = document.createElement('input');
            const inputEmail = document.createElement('input');
            const inputUserType = document.createElement('input');
            const inputPremiumActive = document.createElement('input');
            const inputPremiumDate = document.createElement('input');

            [inputName, inputUsername, inputEmail, inputUserType, inputPremiumActive, inputPremiumDate].forEach((element) => {
              element.classList.add('edit-input');
            })

            inputPremiumDate.type = 'date';
            
            inputName.value = item.name;
            inputUsername.value = item.username;
            inputEmail.value = item.email;
            inputUserType.value = item.user_type;
            inputPremiumActive.value = item.premium_active;
            inputPremiumDate.value = item.premium_date.slice(0, 10); //dateFormat(item.premium_date);

            name.appendChild(inputName);
            username.appendChild(inputUsername);
            email.appendChild(inputEmail);
            userType.appendChild(inputUserType);
            premiumActive.appendChild(inputPremiumActive);
            premiumDate.appendChild(inputPremiumDate);

            buttonConfirm.addEventListener('click', () => {
              const data = {
                name: inputName.value,
                username: inputUsername.value,
                email: inputEmail.value,
                user_type: inputUserType.value,
                premium_active: inputPremiumActive.value,
                premium_date: inputPremiumDate.value,
              }
              
              updateUser(item.username, data)
              .then(() => {
                contentTable.innerHTML = '';
                getUsers();
              })
              .catch(error => {
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
                if (data.result.success) contentTable.removeChild(tableRow);
              })
            }));
          });
      });

  }

  function getUsers() {
    fetch(`http://localhost:3000/api/login/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Falha carregar postagens');
      }
      return response.json();
    })
    .then((response) => {
      console.log(response);
      renderUsersTable(response);
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
  }

  const logoutButton = adminElement.querySelector('.logout');
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

  // Retorna o elemento principal
  return adminElement;
}




async function updateUser(username, data) {
  fetch('http://localhost:3000/api/login/user/' + username, {
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
        
        console.log(data);
        return;
      })
      .catch((err) => {
        console.error(err);
      });
}

async function deleteUser(id) {
  return fetch('http://localhost:3000/api/login/user/' + id, {
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
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
}
