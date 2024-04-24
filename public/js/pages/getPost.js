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
          <div id="news-body"></div>
          <div id="news-interaction-buttons">

          <span id="likes-quantity" class="likes-quantity"></span>
          <button id="like-button" class="button-transparent">
            <span id="like-icon" class="material-symbols-outlined">favorite</span>
          </button>
          <button id="favorite-button" class="button-transparent">
            <span id="favorite-icon" class="material-symbols-outlined">bookmark_add</span>
          </button>


          </div>
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
  const newsBody = getPostElement.querySelector('#news-body');

  const newsInteractionButtons = getPostElement.querySelector('#news-interaction-buttons');
  const likesQuantity = getPostElement.querySelector('#likes-quantity');
  const buttonLike = getPostElement.querySelector('#like-button');
  const buttonFavorite = getPostElement.querySelector('#like-favorite');
  const likeIcon = getPostElement.querySelector('#like-icon');
  const favoriteIcon = getPostElement.querySelector('#favorite-icon');

  const commentEditor = getPostElement.querySelector('#comment-editor');
  const commentTextarea = getPostElement.querySelector('#comment-textarea');
  const buttonsContainer = getPostElement.querySelector('#buttons-container');
  const buttonCancel = getPostElement.querySelector('#cancel-button');
  const buttonComment = getPostElement.querySelector('#comment-button');
  const commentsList = getPostElement.querySelector('#comments-list');


  // Carrega os dados do usuário logado
  // Todas as requisições que dependam do ID do usuário serão feitas aqui dentro
  getLogin()
  .then(userData => {
    return { userData: userData, postPromise: getPostById(postId) };
  })
  .then(({ userData, postPromise }) => {
    return postPromise.then(post => ({ userData, post }));
  })
  .then(({ userData, post }) => {
    return getIsLiked(postId, userData.id)
  .then(isliked => ({ userData, post, isliked }));
  })
  .then(({ userData, post, isliked }) => {

      console.log("xx", userData, post, isliked);

      

      const title = document.createElement('h1');
      const content = document.createElement('div');
      title.innerText = post.title;
      content.innerHTML = post.content;
      newsBody.append(title, content);

      renderLikeAndFavorite(post, isliked);

      let liked = isliked[0] ? true : false;

      buttonLike.addEventListener('click', async () => {
        const newQuantity = await likePost(postId, userData.id);
        likesQuantity.innerText = `${newQuantity} curtidas`;

        if (liked) {
          likeIcon.classList.remove('liked');
          liked = false;
        }
        else {
          likeIcon.classList.add('liked');
          liked = true;
        }
      });

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
      console.error('Erro ao carregar dados página:', error);
    });

   

// Faz requisição de consulta de comments por post ID
  getCommentsByPostId(postId)
  .then(data => {
    
    renderCommentsByPostId(data);
  })
  .catch(error => {
    console.error('Erro ao buscar post:', error);
  });

  function renderLikeAndFavorite(post, isliked){
    console.log("rendlikefav:", post);

    if (isliked[0]) likeIcon.classList.add('liked');

    likesQuantity.innerText = `${post.likes_quantity} curtidas`;
  }
  


  buttonGet.addEventListener('click', async () => {
    // Faz requisição de consulta de post por ID
    getPostById(inputId.value)
    .then(data => {
      const title = document.createElement('h1');
      const content = document.createElement('div');

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
      const separatorDot = document.createElement('span');
      const content = document.createElement('div');


      div.classList.add('comment');
      headerDiv.classList.add('comment-header');
      profilePhoto.classList.add('profile-photo');
      name.classList.add('user-name');
      createdAt.classList.add('created-at');
      separatorDot.classList.add('separator-dot');
      content.classList.add('comment-content');

      profilePhoto.src = comment.profile_photo || '../../uploads/profile_photo/default_profile_normal.png'
      name.innerText = comment.name ;
      createdAt.innerText = getTimeAgo(comment.created_at);
      separatorDot.innerText = '·';
      content.innerHTML = comment.content;

      headerDiv.append(profilePhoto, name, separatorDot, createdAt);
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

async function getIsLiked(posts_id, users_id) {
  
  const queryParams = new URLSearchParams({ posts_id, users_id }).toString();
  console.log("query", queryParams);
  return fetch(`http://localhost:3000/api/likes/posts/isliked?${queryParams}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
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
      console.log("get isliked :", data);
      return data.data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function likePost(posts_id, users_id){
  const data = { posts_id, users_id };

  return fetch('http://localhost:3000/api/likes/posts', {
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
    console.log("like post :", data);
      return data.data[0].like_unlike;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

function getTimeAgo(postDate) {
  const currentDate = new Date();
  const postDateObj = new Date(postDate);

  const timeDifference = currentDate.getTime() - postDateObj.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days + (days === 1 ? ' day ago' : ' days ago');
  else if (hours > 0) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  else if (minutes > 0) return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago');
  else return 'Just now';
}