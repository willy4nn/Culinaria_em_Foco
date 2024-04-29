// main.js

// Importa a função createCustomEvent do módulo de eventos
import { dateFormat } from '../utils/dateFormat.js';
import createCustomEvent from '../eventModule.js';
import setNavigation from '../setNavigation.js';
import header from './elements/header.js';
import footer from './elements/footer.js';
import menuToggle from './elements/menuToggle.js';

// Exporta a função principal que retorna a página principal
export default function dashboard() {
  // HTML do elemento principal
  const dashboardContentHTML = `

    <main>
      
      <div id="container-dashboard">

        <div id="container-header">
            <h1>Dashboard</h1>
        </div>

        <div id="dashboard-content">
        <div class="table-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Banner</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Posted</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Likes</th>
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
  const dashboardElement = document.createElement('div');
  dashboardElement.innerHTML = dashboardContentHTML;

  //Adiciona os elementos footer e header
  const main = dashboardElement.querySelector("main") 
  dashboardElement.insertBefore(header(), main)
  dashboardElement.append(footer())
  dashboardElement.append(menuToggle())  

  const containerDashbaord = dashboardElement.querySelector('#container-dashboard');
  const contentTable = dashboardElement.querySelector('#content-table');

  
  fetch(`http://localhost:3000/api/posts/`, {
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


  function renderNews(data){

    // For apenas para testar a renderização com mais dados
    for(let i=0; i<10; i++) {

      data.forEach((item, index) => {
        
          console.log(item);
          const trableRow = document.createElement('tr');
          const title = document.createElement('td');
          const banner = document.createElement('td');
          const bannerImg = document.createElement('img');
          const category = document.createElement('td');
          const created_at = document.createElement('td');
          const updated_at = document.createElement('td');
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
          updated_at.innerText = dateFormat(item.updated_at);
          posted.innerText = item.posted_draft ? 'Posted' : 'Draft';
          status.innerText = item.status.charAt(0).toUpperCase() + item.status.slice(1);
          commentsQuantity.innerText = item.comments_quantity;
          likesQuantity.innerText = item.likes_quantity;
          buttonEdit.innerText = 'Edit';
          buttonDelete.innerText = 'Delete';

          bannerImg.classList.add('banner-image');

          //div.style.border = 'thin solid #b1b1b1';

          banner.appendChild(bannerImg);
          tdEdit.appendChild(buttonEdit);
          tdDelete.appendChild(buttonDelete);

          trableRow.append(title, banner, category, created_at, updated_at, posted, 
                            status, commentsQuantity, likesQuantity, tdEdit, tdDelete
          );
            
          contentTable.appendChild(trableRow);

          buttonEdit.addEventListener('click', (e) => {
            //setNavigation("colocar um icon edit", `/post/${item.id}`);
            window.dispatchEvent(createCustomEvent(`/post/edit/${item.id}`));
          });
          
          buttonDelete.addEventListener('click', (e) => {

          });
      });
    }
  }

  const logoutButton = dashboardElement.querySelector('.logout');
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
  return dashboardElement;
}
