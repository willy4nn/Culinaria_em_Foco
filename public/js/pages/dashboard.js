// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import displayModal from '../utils/modal.js';
import setNavigation from '../setNavigation.js';

// Exporta a função principal que retorna a página principal
export default function dashboard() {
  // HTML do elemento principal
  const dashboardContentHTML = `
    <main class="main">
      <div id="container-dashboard">
          <div id="container-header">
              <h1 class="primary-heading">Postagens</h1>
          </div>
          <div class="dashboard-content">
              <table id="content-table" class="content-table dashboard-format">
                  <!-- <thead>
                      <tr>
                          <th class="paragraph-medium">Título</th>
                          <th class="paragraph-medium">Banner</th>
                          <th class="paragraph-medium">Categoria</th>
                          <th class="paragraph-medium">Data</th>
                          <th class="paragraph-medium">Exibição</th>
                          <th class="paragraph-medium">Status</th>
                          <th class="paragraph-medium">Comentários</th>
                          <th class="paragraph-medium">Likes</th>
                          <th class="paragraph-medium">Visualizar</th>
                          <th class="paragraph-medium">Editar</th>
                          <th class="paragraph-medium">Deletar</th>
                      </tr>
                  </thead> -->
                  <tbody id="content-table-body"></tbody>
              </table>
          </div>
      </div>
    </main>
  `;

  // Cria o elemento principal
  const dashboardElement = document.createElement('div');
  dashboardElement.classList.add('dashboard-container');
  dashboardElement.innerHTML = dashboardContentHTML;

  // Adiciona os elementos footer e header
  const main = dashboardElement.querySelector("main");
  dashboardElement.insertBefore(header(), main);
  dashboardElement.append(footer());

  const contentTableBody = dashboardElement.querySelector('#content-table-body');

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

          tableRow.innerHTML = `
            <td class="paragraph-normal">${item.title}</td>
            <!--<td><img src="${item.banner}" class="banner-image"></td>-->
            <td class="paragraph-normal">Categoria: ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</td>
            <td class="paragraph-normal">Postagem: ${dateFormat(item.created_at)}</td>
            <td class="paragraph-normal">Exibição: ${item.posted_draft ? 'Posted' : 'Draft'}</td>
            <td class="paragraph-normal">Status: ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</td>
            <td class="paragraph-normal">Comentários: ${item.comments_quantity}</td>
            <td class="paragraph-normal">Curtidas: ${item.likes_quantity}</td>
            <td class="paragraph-medium"><button class="table-button button-line visualize">Visualzar</button></td>
            <td class="paragraph-medium"><button class="table-button button-fill">Editar</button></td>
            <td class="paragraph-medium"><button class="table-button button-delete">Deletar</button></td>
          `;

          const visualizeButton = tableRow.querySelector('.visualize');
          setNavigation(visualizeButton, `/post/${item.id}`);

          tableRow.querySelector('.table-button.button-fill').addEventListener('click', (e) => {
            window.dispatchEvent(createCustomEvent(`/post/edit/${item.id}`));
            e.stopPropagation();
          });

          tableRow.querySelector('.table-button.button-delete').addEventListener('click', () => {
            const message = document.createElement('span');
            message.innerText = "Tem certeza que deseja excluir esta postagem?"

            contentTableBody.appendChild(displayModal(message, async () => {
              deletePost(item.id)
              .then((data) => {
                if (data.result.success) {
                  contentTableBody.innerHTML = '';
                  getPostsByEditorId();
                  showPopup(data.result.message, 'Sucesso!', data.result.success);
                } else {
                  showPopup(data.result.message, 'Erro!', data.result.success);
                }
              })
            }));
          });

          contentTableBody.appendChild(tableRow);
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
      return data;
    })
    .catch((err) => {
      console.error(err);
    })
};