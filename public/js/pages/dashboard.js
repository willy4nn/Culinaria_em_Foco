// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import displayModal from '../utils/modal.js';
import setNavigation from '../setNavigation.js';
import { translate } from '../utils/translate.js';

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

  const contentTable = dashboardElement.querySelector('#content-table');
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
      // Insere o header no início da tabela
      contentTable.insertBefore(tableHeader(), contentTable.firstChild);

      data.forEach((item, index) => {
          const tableRow = document.createElement('tr');

          tableRow.innerHTML = `
            <td class="paragraph-normal">${item.title}</td>
            <!--<td><img src="${item.banner}" class="banner-image"></td>-->
            <td class="paragraph-normal">${translate(item.category)}</td>
            <td class="paragraph-normal">${dateFormat(item.created_at)}</td>
            <td class="paragraph-normal">${item.posted_draft ? 'Postado' : 'Rascunho'}</td>
            <td class="paragraph-normal">${translate(item.status)}</td>
            <td class="paragraph-normal">${item.comments_quantity}</td>
            <td class="paragraph-normal">${item.likes_quantity}</td>
            <td class="paragraph-medium"><button class="table-button button-line visualize">Visualizar</button></td>
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

// Função que gera o header
function tableHeader() {
  const thead = document.createElement('thead');
  const row = document.createElement('tr');
  const title = document.createElement('th');
  /* const banner = document.createElement('th'); */
  const category = document.createElement('th');
  const createdAt = document.createElement('th');
  const postedDraft = document.createElement('th');
  const status = document.createElement('th');
  const comments = document.createElement('th');
  const likes = document.createElement('th');
  const visualize = document.createElement('th');
  const edit = document.createElement('th');
  const exclude = document.createElement('th');

  thead.classList.add('table-header-thead');
  /* [title, banner, category, createdAt, postedDraft, status, comments, likes, visualize, edit, exclude].forEach((element) => {
    element.classList.add('paragraph-normal');
  });*/
  title.innerText = 'Título';
  /* banner.innerText = 'Banner'; */
  category.innerText = 'Categoria';
  createdAt.innerText = 'Postagem';
  postedDraft.innerText = 'Exibição';
  status.innerText = 'Status';
  comments.innerText = 'Comentários';
  likes.innerText = 'Curtidas';
  visualize.innerText = 'Visualizar';
  edit.innerText = 'Editar';
  exclude.innerText = 'Deletar';

  row.append(title, category, createdAt, postedDraft, status, comments, likes, visualize, edit, exclude);
  thead.appendChild(row);

  return thead;
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
