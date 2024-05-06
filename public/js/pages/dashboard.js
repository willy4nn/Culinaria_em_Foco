// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import displayModal from '../utils/modal.js';
// import menuToggle from './elements/menuToggle.js';

// Exporta a função principal que retorna a página principal
export default function dashboard() {
  // HTML do elemento principal
  const dashboardContentHTML = `

    <main class="">
      
      <div id="container-dashboard">

        <div id="container-header">
            <h1 class="secondary-heading">Painel do Editor</h1>
        </div>

        <div id="dashboard-content">
        <div class="table-header">
          <table cellpadding="0" cellspacing="0" border="0" class="dashboard-format">
              <tr>
                <th>Título</th>
                <th>Banner</th>
                <th>Categoria</th>
                <th>Data</th>
              <!-- <th>Updated At</th> -->
                <th>Exibição</th>
                <th>Status</th>
                <th>Comentários</th>
                <th>Likes</th>
                <th>Editar</th>
                <th>Deletar</th>
              </tr>
          </table>
        </div>
        <div class="table-content">
          <table id="content-table" class="dashboard-format">
          </table>
        </div>

      </div>

    </main>

  `;

  // Cria o elemento principal
  const dashboardElement = document.createElement('div');
  dashboardElement.innerHTML = dashboardContentHTML;

  //Adiciona os elementos footer e header
  const main = dashboardElement.querySelector("main") 
  dashboardElement.insertBefore(header(), main)
  dashboardElement.append(footer())
  // dashboardElement.append(menuToggle())  

  const containerDashbaord = dashboardElement.querySelector('#container-dashboard');
  const contentTable = dashboardElement.querySelector('#content-table');

  getPostsByEditorId();

  function getPostsByEditorId() {
    fetch(`/api/posts/`, {
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
      renderNews(response.data);
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
  }


  function renderNews(data){

      data.forEach((item, index) => {
          const tableRow = document.createElement('tr');
          const title = document.createElement('td');
          const banner = document.createElement('td');
          const bannerImg = document.createElement('img');
          const category = document.createElement('td');
          const created_at = document.createElement('td');
          //const updated_at = document.createElement('td');
          const posted = document.createElement('td');
          const status = document.createElement('td');
          const commentsQuantity = document.createElement('td');
          const likesQuantity = document.createElement('td');
          const tdEdit = document.createElement('td');
          const tdDelete = document.createElement('td');

          const buttonEdit = document.createElement('button');
          const buttonDelete = document.createElement('button');

          title.innerText = item.title;
          bannerImg.src = item.banner;
          category.innerText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
          created_at.innerText = dateFormat(item.created_at);
          /* updated_at.innerText = dateFormat(item.updated_at); */
          posted.innerText = item.posted_draft ? 'Posted' : 'Draft';
          status.innerText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
          commentsQuantity.innerText = item.comments_quantity;
          likesQuantity.innerText = item.likes_quantity;
          buttonEdit.innerText = 'Editar';
          buttonDelete.innerText = 'Deletar';

          bannerImg.classList.add('banner-image');
          buttonEdit.classList.add('table-button', 'button-fill');
          buttonDelete.classList.add('table-button', 'button-delete');

          banner.appendChild(bannerImg);
          tdEdit.appendChild(buttonEdit);
          tdDelete.appendChild(buttonDelete);

          tableRow.append(title, banner, category, created_at, posted, 
                            status, commentsQuantity, likesQuantity, tdEdit, tdDelete
          );
            
          contentTable.appendChild(tableRow);

          tableRow.addEventListener('click', () => {
            window.dispatchEvent(createCustomEvent(`/post/${item.id}`));
          })

          buttonEdit.addEventListener('click', () => {
            window.dispatchEvent(createCustomEvent(`/post/edit/${item.id}`));
          });
          
          buttonDelete.addEventListener('click', () => {
            const message = document.createElement('span');
            message.innerText = "Tem certeza que deseja excluir esta postagem?"

            contentTable.appendChild(displayModal(message, async () => {
              deletePost(item.id)
              .then((data) => {
                if (data.result.success) {
                  contentTable.innerHTML = '';
                  getPostsByEditorId();
                  showPopup(data.result.message, 'Sucesso!', data.result.success);
                } else {
                  showPopup(data.result.message, 'Erro!', data.result.success);
                }
              })
            }));
          });
      });
  }  

  // Retorna o elemento principal
  return dashboardElement;
}

async function deletePost(id) {
  return fetch('/api/posts/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(
            `Não foi possível deletar o post! ${error.message}`
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
    })
};