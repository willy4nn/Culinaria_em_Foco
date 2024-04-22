import createCustomEvent from '../eventModule.js';

// Exporta a função que retorna a página de login
export default function getPost(postId) {
  // HTML do elemento de login
  const getPostContentHTML = `
    <header class="header">
      <div class="logo">
        <img src="/assets/images/croissant-logo.svg" alt="Logo Chef's Corner" />
        <span>Chef's Corner</span>
      </div>
      <div class="buttons">
        <a class="button button-fill">Sign Up</a>
      </div>
    </header>
    <main class=""> 

      <div id="container">
        <div id="buttons-temp">
          <button id="button-get">Buscar</button>
          <input id="input-id" placeholder="ID do Post"></input>
        </div>
        </br>

        <div id="news-container">
        </div>

        <div id="comments-container">
          <div id="comment-editor">
            <div id="input-container">
              <textarea id="comment-textarea" placeholder="Add a comment" rows="1"></textarea>
            </div>
            <div id="buttons-container">
              <button id="cancel-button" class="comment-button button-fill-cancel">Cancel</button>
              <button id="comment-button" class="comment-button button-fill">Comment</button>
            </div>
          </div>

          <div id="comments-list">
          </div>
        </div>

      </div>

    </main>
    <footer class="footer">
      <p>© 2024 Chef's Corner. All rights reserved.</p>
    </footer>
  `;

  const getPostElement = document.createElement('div');
  getPostElement.classList.add('create-post-element');
  getPostElement.innerHTML = getPostContentHTML;

  const buttonGet = getPostElement.querySelector('#button-get');
  const inputId = getPostElement.querySelector('#input-id');
  const newsContainer = getPostElement.querySelector('#news-container');

  const commentEditor = getPostElement.querySelector('#comment-editor');
  const commentTextarea = getPostElement.querySelector('#comment-textarea');
  const buttonsContainer = getPostElement.querySelector('#buttons-container');
  const buttonCancel = getPostElement.querySelector('#cancel-button');
  const buttonComment = getPostElement.querySelector('#comment-button');
  const commentsList = getPostElement.querySelector('#comments-list');


  // Carrega os dados do usuário logado.
  getLogin()
    .then(data => {
      const userData = data;

      buttonComment.addEventListener('click', function(e) {
        const data = {
          posts_id: postId,
          users_id: userData.id,
          content: commentTextarea.value.trim().toString(),
        }

        commentTextarea.value = "";
  
        //Alterar para inserir somente o novo comentário ao invés de da um fetch em todos.
        console.log("create comment data", data);
        createComment(data)
          .then(() => {
            getCommentsByPostId(postId)
            .then(data => {   
              renderCommentsByPostId(data);
            })
            .catch(error => {
              console.error('Erro ao buscar post:', error);
            });
          })
      });
    })
    .catch(error => {
      console.error('Erro ao carregar dados do usuário:', error);
    });


  // Faz requisição de consulta de post por ID
  getPostById(postId)
  .then(data => {
    const title = document.createElement('h1');
    const content = document.createElement('content');

    title.innerText = data.title;
    content.innerHTML = data.content;

  newsContainer.append(title, content);
  })
  .catch(error => {
    console.error('Erro ao buscar post:', error);
  });

// Faz requisição de consulta de comments por post ID
  getCommentsByPostId(postId)
  .then(data => {
    
    renderCommentsByPostId(data);
  })
  .catch(error => {
    console.error('Erro ao buscar post:', error);
  });
  


  buttonGet.addEventListener('click', async () => {
    // Faz requisição de consulta de post por ID
    getPostById(inputId.value)
    .then(data => {
      const title = document.createElement('h1');
      const content = document.createElement('content');

      title.innerText = data.title;
      content.innerHTML = data.content;

      newsContainer.append(title, content);
    })
    .catch(error => {
      console.error('Erro ao buscar post:', error);
    });
  });

  commentEditor.addEventListener('click', function() {
    buttonsContainer.style.display = 'flex';
    commentEditor.style.border = 'solid 1px #909090';
    commentTextarea.placeholder = '';
    commentTextarea.style.height = 'auto';
    commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
  });

  buttonCancel.addEventListener('click', function(e) {
    e.stopPropagation(); //Evita evento de click propague para commentEditor, causando conflito.
    commentTextarea.value = '';
    buttonsContainer.style.display = 'none';
    commentTextarea.style.height = 'auto'; 
    commentTextarea.style.height = commentTextarea.scrollHeight + 'px';
    commentTextarea.rows = '1';
    commentEditor.style.border = "solid 1px #cccccc";
    commentTextarea.placeholder = 'Add a comment';
  });

  commentTextarea.addEventListener('input', function() {
    /* commentTextarea.rows = commentTextarea.scrollHeight / 15 + 1;
    console.log(commentTextarea.scrollHeight)
    console.log(commentTextarea.rows); */

    commentTextarea.style.height = 'auto'; // Redefine a altura para automática
    commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
  });

  function renderCommentsByPostId(data) {
    commentsList.innerHTML = "";

    data.forEach(comment => {
      const div = document.createElement('div');
      const headerDiv = document.createElement('div');

      const profilePhoto = document.createElement('img');
      const name = document.createElement('p');
      const createdAt = document.createElement('p');
      const content = document.createElement('content');

      div.classList.add('comment');
      headerDiv.classList.add('comment-header');
      profilePhoto.classList.add('profile-photo');
      name.classList.add('user-name');
      createdAt.classList.add('created-at');
      content.classList.add('comment-content');

      profilePhoto.src = comment.profile_photo || '../../uploads/profile_photo/default_profile_normal.png'
      name.innerText = comment.name ;
      //createdAt.innerText = comment.created_at;
      createdAt.innerText = '·  4 min' ;
      content.innerHTML = comment.content;

      headerDiv.append(profilePhoto, name, createdAt);
      div.append(headerDiv, content);
      commentsList.appendChild(div);
    });
  }

  

  return getPostElement;
}

async function getPostById(id) {
  return fetch('http://localhost:3000/api/posts/' + id)
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      console.log("get post :", data);
      return data.data[0];
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function getCommentsByPostId(id) {
  return fetch('http://localhost:3000/api/comments/search?posts_id=' + id)
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      console.log("get comments :", data);
      return data.data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function createComment(data) {
  return fetch('http://localhost:3000/api/comments/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
    console.log("get post :", data);
      return data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function getLogin() {
  return fetch('http://localhost:3000/api/login/user')
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      console.log("get user :", data);
      return data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}


/* fetchUserData();

  // Carrega os dados do usuário logado.
  async function fetchUserData() {

    const userData = await getLogin()
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Erro ao buscar post:', error);
    });

    buttonComment.addEventListener('click', async function(e) {
      console.log("us", userData);
      const data = {
        posts_id: postId,
        users_id: await userData.id,
        content: commentTextarea.value.trim().toString(),
      }

      console.log("create comment data", data); return;
      createComment(data);
    });
  } */