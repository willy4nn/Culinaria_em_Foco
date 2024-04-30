import { getTimeAgo, loaderr, loading } from '../components/animation2.js';
import { loadComment } from '../components/comment.js';
import { loadPost } from '../components/post.js';
import createCustomEvent from '../eventModule.js';

let userLogged;
// Exporta a função que retorna a página de login
export default function refactoringGetPost(postId) {
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

  const elements = {
    buttonGet: '#button-get',
    inputId: '#input-id',
    newsContainer: '#news-container',
    newsBody: '#news-body',
    newsInteractionButtons: '#news-interaction-buttons',
    likesQuantity: '#likes-quantity',
    buttonLike: '#like-button',
    buttonFavorite: '#favorite-button',
    likeIcon: '#like-icon',
    favoriteIcon: '#favorite-icon',
    commentEditor: '#comment-editor',
    commentTextarea: '#comment-textarea',
    buttonsContainer: '#buttons-container',
    buttonCancel: '#cancel-button',
    buttonComment: '#comment-button',
    commentsList: '#comments-list'
  };

  const elementsMapped = Object.entries(elements).reduce((acc, [key, value]) => {
    acc[key] = getPostElement.querySelector(value);
    return acc;
  }, {});

  const { buttonGet, inputId, newsContainer, newsBody, newsInteractionButtons, likesQuantity, buttonLike, buttonFavorite, likeIcon, favoriteIcon, commentEditor, commentTextarea, buttonsContainer, buttonCancel, buttonComment, commentsList } = elementsMapped;

  
//TODO, pegar os isliked e o isfavorited já na query

  loadUser();
  loadPost(postId).then(renderPost);
  loadComment(postId)
  .then((data) => {
    data.forEach(comment => commentsList.appendChild(comment)); 
  });

  function loadUser() {
    getLogin().then(userData => { userLogged = userData })
  };

  async function renderPost({ post, isliked, isfavorited }) {
    const title = document.createElement('h1');
    const content = document.createElement('div');
    title.innerText = post.title;
    content.innerHTML = post.content;
    newsBody.append(title, content);
    renderLikeAndFavorite(post, isliked, isfavorited);
    let liked = isliked[0] ? true : false;
    let favorited = isfavorited[0] ? true : false;
    buttonLike.addEventListener('click', async () => {
      const newQuantity = await likePost(postId);
      likesQuantity.innerText = `${newQuantity} curtidas`;
      liked = !liked;
      likeIcon.classList.toggle('liked', liked);
    });
    buttonFavorite.addEventListener('click', async () => {
      const newFavorited = await favoritePost(postId);
      favoriteIcon.innerText = newFavorited ? 'bookmark_added' : 'bookmark_add';
      favorited = newFavorited;
      favoriteIcon.classList.toggle('favorited', favorited);
    });
    buttonComment.addEventListener('click', async () => {
      const value = commentTextarea.value.trim();
      if (!value) return;
      const data = { posts_id: postId, content: value };
      commentTextarea.value = '';
      try {
        await createComment(data);
        renderComments();
      } catch (error) {
        console.error('Erro ao criar comentário:', error);
      }
    });
  }


  function renderLikeAndFavorite(post, isliked, isfavorited) {
    if (isliked[0]) likeIcon.classList.add('liked');
    likesQuantity.innerText = `${post.likes_quantity} curtidas`;
    if (isfavorited[0]) {
      favoriteIcon.innerText = 'bookmark_added';
      favoriteIcon.classList.add('favorited');
    }
  }


  // Event listener para buscar post por ID
  buttonGet.addEventListener('click', async () => {
    try {
      const data = await getPostById(inputId.value);
      const title = document.createElement('h1');
      const content = document.createElement('div');
      title.innerText = data.title;
      content.innerHTML = data.content;
      newsContainer.append(title, content);
    } catch (error) {
      console.error('Erro ao buscar post:', error);
    }
  });

  // Event listeners para interação com a seção de comentários
  commentEditor.addEventListener('click', () => {
    buttonsContainer.style.display = 'flex';
    commentEditor.style.border = 'solid 1px #909090';
    commentTextarea.placeholder = '';
    commentTextarea.style.height = 'auto';
    commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px';
    commentTextarea.focus();
  });

  buttonCancel.addEventListener('click', () => {
    commentTextarea.value = '';
    buttonsContainer.style.display = 'none';
    commentTextarea.style.height = 'auto';
    commentTextarea.style.height = commentTextarea.scrollHeight + 'px';
    commentTextarea.rows = '1';
    commentEditor.style.border = "solid 1px #cccccc";
    commentTextarea.placeholder = 'Add a comment';
  });

  commentTextarea.addEventListener('input', () => {
    commentTextarea.style.height = 'auto';
    commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px';
  });

  return getPostElement;
  
}

export { userLogged };




/* POSTS */

async function getPostById(id) {
  console.log(id);
  return fetch('/api/posts/' + id)
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

async function likePost(posts_id){
  const data = { posts_id };

  return fetch('/api/likes/posts', {
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

async function favoritePost(posts_id){
  const data = { posts_id };

  return fetch('/api/favorite', {
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
    console.log("favorite post :", data);
      return data.data[0].favorite_unfavorite;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

/* COMMENTS */

async function createComment(data) {
  return fetch('/api/comments/', {
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
    console.log("create comment:", data);
      return data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

/* REPLIES */

/* OTHERS */

async function getLogin() {
  return fetch('/api/login/user')
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

