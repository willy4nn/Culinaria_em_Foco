import header from './elements/header.js';
import footer from './elements/footer.js';
import { modalError } from './elements/modalError.js';
import { dateFormat } from '../utils/dateFormat.js';

// Exporta a função que retorna a página de login
export default function getPost(postId) {
  // HTML do elemento de login
  const getPostContentHTML = `
    <main class="main">
      <div id="container">
        <div id="news-container">
          <div id="news-body"></div>
          <div id="news-interaction-buttons">
            <span id="likes-quantity" class="likes-quantity paragraph-bold"></span>
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
              <textarea id="comment-textarea" class="paragraph-normal" placeholder="Adicionar comentário" rows="1"></textarea>
            </div>
            <div id="buttons-container">
              <button id="cancel-button" class="comment-button button-fill-cancel">Cancelar</button>
              <button id="comment-button" class="comment-button button-fill">Comentar</button>
            </div>
          </div>
          <div id="comments-list"></div>
        </div>
      </div>
    </main>
  `;

  const getPostElement = document.createElement('div');
  getPostElement.classList.add('get-post-container');
  getPostElement.innerHTML = getPostContentHTML;

  //Adiciona os elementos footer e header
  const main = getPostElement.querySelector("main") 
  getPostElement.insertBefore(header(), main)
  getPostElement.append(footer())
  const { popupCard, showPopup } = modalError();
  //main.appendChild(popupCard);
  main.insertAdjacentElement("afterend", popupCard);
  
  //const buttonGet = getPostElement.querySelector('#button-get');
  //const inputId = getPostElement.querySelector('#input-id');

  const newsContainer = getPostElement.querySelector('#news-container');
  const newsBody = getPostElement.querySelector('#news-body');

  const newsInteractionButtons = getPostElement.querySelector('#news-interaction-buttons');
  const likesQuantity = getPostElement.querySelector('#likes-quantity');
  const buttonLike = getPostElement.querySelector('#like-button');
  const buttonFavorite = getPostElement.querySelector('#favorite-button');
  const likeIcon = getPostElement.querySelector('#like-icon');
  const favoriteIcon = getPostElement.querySelector('#favorite-icon');

  const commentEditor = getPostElement.querySelector('#comment-editor');
  const commentTextarea = getPostElement.querySelector('#comment-textarea');
  const buttonsContainer = getPostElement.querySelector('#buttons-container');
  const buttonCancel = getPostElement.querySelector('#cancel-button');
  const buttonComment = getPostElement.querySelector('#comment-button');
  const commentsList = getPostElement.querySelector('#comments-list');

  let userLogged;
  
  // Carrega os dados do usuário logado
  // Todas as requisições que dependam do ID do usuário serão feitas aqui dentro
  getLogin()
  .then(userData => {
    userLogged = userData;
    return { userData: userData, postPromise: getPostById(postId) };
  })
  .then(({ userData, postPromise }) => {
    return postPromise.then(post => ({ userData, post }));
  })
  .then(({ userData, post }) => {
    return getIsLiked(postId)
  .then(isliked => ({ userData, post, isliked }));
  })
  .then(({ userData, post, isliked }) => {
    return getIsFavorited(postId)
      .then(isfavorited => ({ userData, post, isliked, isfavorited }));
  })
  .then(({ userData, post, isliked, isfavorited }) => {

      const title = document.createElement('h1');
      title.classList.add('post-heading')
      const content = document.createElement('div');
      title.innerText = post.title;
      content.innerHTML = post.content;
      
      const banner = document.createElement('img');
      const div = document.createElement('div');
      const createdAtPost = document.createElement('span');
      banner.src = post.banner;
      createdAtPost.innerText = dateFormat(post.created_at);

      banner.classList.add('post-banner');
      div.classList.add('post-details');
      createdAtPost.classList.add('post-created-at', 'paragraph-bold');
      content.classList.add('post-text-content', 'paragraph-normal');

      div.appendChild(createdAtPost)
      newsBody.append(title, banner, content, div);

      renderLikeAndFavorite(post, isliked, isfavorited);

      let liked = isliked[0] ? true : false;
      let favorited = isfavorited[0] ? true : false;

      buttonLike.addEventListener('click', async () => {
        const newQuantity = await likePost(postId);
        likesQuantity.innerText = newQuantity > 1 ? `${newQuantity} curtidas` : `${newQuantity} curtida`

        if (liked) {
          likeIcon.classList.remove('liked');
          liked = false;
        }
        else {
          likeIcon.classList.add('liked');
          liked = true;
        }
      });

      buttonFavorite.addEventListener('click', async () => {
        const newFavorited = await favoritePost(postId);

        if (newFavorited) {
          favoriteIcon.classList.add('favorited');
          favoriteIcon.innerText = 'bookmark_added';
        }
        else {
          favoriteIcon.classList.remove('favorited');
          favoriteIcon.innerText = 'bookmark_add';
        }
      });

      buttonComment.addEventListener('click', function(e) {
        if (commentTextarea.value.trim().toString() == '') return;

        const data = {
          posts_id: postId,
          content: commentTextarea.value.trim().toString(),
        }

        commentTextarea.value = "";
  
        //Alterar para inserir somente o novo comentário ao invés de da um fetch em todos.
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
  loading(commentsList);
  getCommentsByPostId(postId)
  .then(comments => {
    
    renderCommentsByPostId(comments);
  })
  .catch(error => {
    console.error('Erro ao buscar post:', error);
  });

  function renderLikeAndFavorite(post, isliked, isfavorited){

    if (isliked[0]) likeIcon.classList.add('liked');
    likesQuantity.innerText = post.likes_quantity > 1 ? `${post.likes_quantity} curtidas` : `${post.likes_quantity} curtida`;
    
    if (isfavorited[0]) {
      favoriteIcon.innerText = 'bookmark_added';
      favoriteIcon.classList.add('favorited');
    }
    
  }

  commentEditor.addEventListener('click', function() {
    buttonsContainer.style.display = 'flex';
    commentEditor.style.border = 'solid 1px #909090';
    commentTextarea.placeholder = '';
    commentTextarea.style.height = 'auto';
    commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
    commentTextarea.focus();
  });

  buttonCancel.addEventListener('click', function(e) {
    e.stopPropagation(); //Evita evento de click propague para commentEditor, causando conflito.
    commentTextarea.value = '';
    buttonsContainer.style.display = 'none';
    commentTextarea.style.height = 'auto'; 
    commentTextarea.style.height = commentTextarea.scrollHeight + 'px';
    commentTextarea.rows = '1';
    commentEditor.style.border = "solid 1px #cccccc";
    commentTextarea.placeholder = 'Adicionar comentário';
  });

  commentTextarea.addEventListener('input', function() {
    commentTextarea.style.height = 'auto'; // Redefine a altura para automática
    commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
  });

  function renderCommentsByPostId(data) {
    commentsList.innerHTML = "";

    data.forEach(async comment => {

      const commentIsLiked = await getCommentsIsLiked(comment.id);
      const div = document.createElement('div');
      const headerDiv = document.createElement('div');
      const leftHeaderDiv = document.createElement('div');
      const rightHeaderDiv = document.createElement('div');
      const profilePhoto = document.createElement('img');
      const name = document.createElement('p');
      const createdAt = document.createElement('p');
      const separatorDot = document.createElement('span');
      const content = document.createElement('div');
      const likeIcon = document.createElement('span');
      const openReplyTextarea = document.createElement('span');
      const showRepliesButton = document.createElement('span');
      const showRepliesNumber = document.createElement('span');
      const showRepliesComplement = document.createElement('span');
      const showArrowIcon = document.createElement('span');

      div.classList.add('comment');
      headerDiv.classList.add('comment-header');
      leftHeaderDiv.classList.add('comment-left-header');
      rightHeaderDiv.classList.add('comment-right-header', 'paragraph-bold');

      profilePhoto.classList.add('profile-photo');
      name.classList.add('user-name', 'paragraph-bold');
      createdAt.classList.add('created-at', 'paragraph-normal');
      separatorDot.classList.add('separator-dot');
      content.classList.add('comment-content', 'paragraph-normal');

      likeIcon.classList.add('material-symbols-outlined', 'comment-like');
      if (commentIsLiked) likeIcon.classList.add('liked');
      openReplyTextarea.classList.add('open-reply');
      showRepliesButton.classList.add('show-reply');
      showRepliesNumber.classList.add('reply-quantity');
      showArrowIcon.classList.add('material-symbols-outlined', 'arrow-icon');

      profilePhoto.src = comment.profile_photo || '../../uploads/profile_photo/default_profile_normal.png';
      name.innerText = comment.name ;
      createdAt.innerText = getTimeAgo(comment.created_at);
      separatorDot.innerText = '·';
      content.innerHTML = comment.content;

      likeIcon.innerHTML = 'favorite';
      openReplyTextarea.innerText = 'Responder';
      showRepliesNumber.innerText = comment.replies_quantity
      showRepliesComplement.innerText = comment.replies_quantity > 1 ? 'respostas' : 'resposta';
      showArrowIcon.innerText = 'arrow_drop_down';
      
      showRepliesButton.append(showArrowIcon, showRepliesNumber, showRepliesComplement);
      leftHeaderDiv.append(profilePhoto, name, separatorDot, createdAt);
      rightHeaderDiv.append(showRepliesButton, openReplyTextarea, likeIcon);

      headerDiv.append(leftHeaderDiv, rightHeaderDiv);
      div.append(headerDiv, content);
      commentsList.appendChild(div);

      // Efetuar like no comentário
      likeIcon.addEventListener('click', async () => {
        const newLiked = await likeComment(comment.id);
        
        const cleanResult = newLiked.substring(1, newLiked.length - 1);
        const values = cleanResult.split(',');
        const isLiked = values[1].trim() === 't' ? true : false;

        if (isLiked) likeIcon.classList.add('liked');
        else likeIcon.classList.remove('liked');
      });

      let shownReply = false;
      let newReplies = document.createElement('div');
      div.appendChild(newReplies);
      // Mostrar respostas
      showRepliesButton.addEventListener('click', async () => {
        if (newReplies.childNodes.length === 0) {
          newReplies.appendChild( await renderRepliesByCommentId(div, comment.id));
          shownReply = true;
          showArrowIcon.innerText = 'arrow_drop_up';

        } else {
          if (!shownReply) {
            newReplies.style.display = 'block';
            shownReply = true;
            showArrowIcon.innerText = 'arrow_drop_up';
          } else {
            newReplies.style.display = 'none';
            shownReply = false;
            showArrowIcon.innerText = 'arrow_drop_down';
          }
        }
        
      });

      let openedReply = false;
      // Responder um comentário (textarea)
      openReplyTextarea.addEventListener('click', () => {
        if (!openedReply) {
          const replyDiv = document.createElement('div');
          const profilePhoto = document.createElement('img');
          const replyTextarea = document.createElement('textarea');
          const contentDiv = document.createElement('div');
          const buttonsDiv = document.createElement('div');
          const buttonCancel = document.createElement('button');
          const buttonReply = document.createElement('button');

          replyDiv.classList.add('reply-container');
          profilePhoto.classList.add('reply-profile-photo');
          replyTextarea.classList.add('reply-textarea');
          contentDiv.classList.add('reply-content-container');
          buttonsDiv.classList.add('reply-buttons-container');
          buttonCancel.classList.add('comment-button', 'button-fill-cancel', 'reply-button');
          buttonReply.classList.add('comment-button', 'button-fill', 'reply-button');
          profilePhoto.src = userLogged.profilePhoto || '../../uploads/profile_photo/default_profile_normal.png';
          replyTextarea.placeholder = 'Adicionar resposta';
          buttonCancel.innerText = 'Cancelar';
          buttonReply.innerText = 'Responder';

          buttonsDiv.append(buttonCancel, buttonReply);
          contentDiv.append(profilePhoto, replyTextarea);
          
          replyDiv.append(contentDiv, buttonsDiv);
          div.insertBefore(replyDiv, newReplies);
          openedReply = true;

          replyTextarea.addEventListener('input', function() {
            replyTextarea.style.height = 'auto'; // Redefine a altura para automática
            replyTextarea.style.height = replyTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
          });

          buttonCancel.addEventListener('click', () => {
            if (openedReply) div.removeChild(replyDiv);
            openedReply = false;
          });

          buttonReply.addEventListener('click', () => {
            if (replyTextarea.value.trim().toString() === '') return;
            replyTextarea.disabled = true;

            const data = {
              posts_comments_id: comment.id,
              content: replyTextarea.value.trim().toString(),
            }

            const dataSuccess = {
              name: userLogged.name,
              content: replyTextarea.value.trim().toString(),
              profile_photo: userLogged.profilePhoto || '../../uploads/profile_photo/default_profile_normal.png',
              created_at: new Date(),
            }

              createReply(data)
            .then(async (data) => {

              if (data) {
                const firstComment = newReplies.firstChild;

                if (newReplies.childNodes.length > 0) firstComment.insertBefore(await replyElement(dataSuccess, div), firstComment.firstChild);
       
                replyTextarea.value = '';
                replyTextarea.disabled = false;
                showRepliesNumber.innerText = parseInt(showRepliesNumber.innerText) + 1;
    
                showArrowIcon.innerText = 'arrow_drop_down';
                shownReply = false;
                showRepliesButton.click();
                openedReply = false;
                replyDiv.remove();
              }
              replyTextarea.disabled = false;
            })
            .catch(error => {
              console.error('Erro ao buscar post:', error);
            });
          });
        }

      });

    // Renderizar respostas dos comentários

      async function replyElement(reply, repliedCommentDiv) {

        let replyIsLiked;
        if (reply.id) {
          replyIsLiked = await getRepliesIsLiked(reply.id);
        }
    
        const newDiv = document.createElement('div');
        const headerDiv = document.createElement('div');
        const leftHeaderDiv = document.createElement('div');
        const rightHeaderDiv = document.createElement('div');
    
        const profilePhoto = document.createElement('img');
        const name = document.createElement('p');
        const createdAt = document.createElement('p');
        const separatorDot = document.createElement('span');
        const content = document.createElement('div');
    
        const likeIcon = document.createElement('span');
        const openReplyReplyTextarea = document.createElement('span');
    
        newDiv.classList.add('comment', 'reply');
        headerDiv.classList.add('comment-header');
        leftHeaderDiv.classList.add('comment-left-header');
        rightHeaderDiv.classList.add('comment-right-header');
    
        profilePhoto.classList.add('reply-profile-photo');
        name.classList.add('user-name');
        createdAt.classList.add('created-at');
        separatorDot.classList.add('separator-dot');
        content.classList.add('comment-content');
    
        likeIcon.classList.add('material-symbols-outlined', 'comment-like');
        if (replyIsLiked) likeIcon.classList.add('liked');
        openReplyReplyTextarea.classList.add('open-reply-reply');
    
        profilePhoto.src = reply.profile_photo || '../../uploads/profile_photo/default_profile_normal.png';
        name.innerText = reply.name ;
        createdAt.innerText = getTimeAgo(reply.created_at);
        separatorDot.innerText = '·';
        content.innerHTML = reply.content;
    
        likeIcon.innerHTML = 'favorite';
        openReplyReplyTextarea.innerText = 'Responder';
    
        leftHeaderDiv.append(profilePhoto, name, separatorDot, createdAt);
        rightHeaderDiv.append(openReplyReplyTextarea, likeIcon);
    
        headerDiv.append(leftHeaderDiv, rightHeaderDiv);
        newDiv.append(headerDiv, content);
    
    
        likeIcon.addEventListener('click', async () => {
          if (!reply.id) {
            newReplies.innerHTML = '';
            shownReply = false;
            showRepliesButton.click();
            return;
          }
          const newLiked = await likeReply(reply.id);
          
          const cleanResult = newLiked.substring(1, newLiked.length - 1);
          const values = cleanResult.split(',');
          const isLiked = values[1].trim() === 't' ? true : false;
    
          if (isLiked) likeIcon.classList.add('liked');
          else likeIcon.classList.remove('liked');
        });
        const replyButton = repliedCommentDiv.querySelector('.open-reply');
        openReplyReplyTextarea.addEventListener('click', () => replyButton.click());
    
    
        return newDiv;
      }
      async function renderRepliesByCommentId(repliedCommentDiv, repliedCommentId) {
        const newReplies = document.createElement('div');
        const loader = loaderr();
        repliedCommentDiv.appendChild(loader);
        
        const repliesloaded = await loadReplies(repliedCommentId, repliedCommentDiv);
        repliesloaded.forEach(reply => newReplies.appendChild(reply));
    
        repliedCommentDiv.removeChild(loader);
        return newReplies;
      }
      
      async function loadReplies(repliedCommentId, repliedCommentDiv) {
        try {
          const replies = await getRepliesByCommentId(repliedCommentId);
          const renderedList = renderReplies(replies, repliedCommentDiv);
    
          return renderedList;
        } catch (error) {
          console.error('Erro ao buscar comentários:', error);
        }
      }
      async function renderReplies(replies, repliedCommentDiv) {
          const replyElementListPromises = replies.map(reply => replyElement(reply, repliedCommentDiv));
          const replyElementList = await Promise.all(replyElementListPromises);
          return replyElementList;
      }
    });
  }

  return getPostElement;
}

/* POSTS */

async function getPostById(id) {
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
      return data.data[0];
  })
  .catch((error) => {
      console.error('Erro:', error.error);
  });
}

async function getIsLiked(posts_id) {
  
  const queryParams = new URLSearchParams({ posts_id }).toString();
  return fetch(`/api/likes/posts/isliked?${queryParams}`, {
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
      return data.data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function getIsFavorited(posts_id) {
  
  const queryParams = new URLSearchParams({ posts_id }).toString();
  return fetch(`/api/favorite/search?${queryParams}`, {
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
      return data.data;
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
      return data.data[0].favorite_unfavorite;
  })
  .catch((error) => {
      console.error('Erro:', error.error);
  });
}

/* COMMENTS */

async function getCommentsByPostId(id) {
  return fetch('/api/comments/search?posts_id=' + id)
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      return data.data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

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

      return data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function likeComment(posts_comments_id){
  const data = { posts_comments_id };

  return fetch('/api/likes/comments', {
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
      return data.data[0].like_unlike_comments;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function getCommentsIsLiked(comments_id) {
  
  const queryParams = new URLSearchParams({ comments_id }).toString();

  return fetch(`/api/likes/comments/isliked?${queryParams}`, {
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
      return data.data[0];
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

/* REPLIES */

async function getRepliesByCommentId(id) {
  return fetch('/api/replies/search?comments_id=' + id)
  .then((response) => {
      if (response.status !== 200) {
          return response.json().then(errorResponse => {
              throw errorResponse;
          });
      }
      return response.json();
  })
  .then((data) => {
      return data.data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function getRepliesIsLiked(replies_id) {
  
  const queryParams = new URLSearchParams({ replies_id }).toString();
  return fetch(`/api/likes/replies/isliked?${queryParams}`, {
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
      return data.data[0];
  })
  .catch((error) => {
      console.error('Erro:', error.error);
  });
}

async function createReply(data) {
  return fetch('/api/replies/', {
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
      return data;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

async function likeReply(comments_replies_id){
  const data = { comments_replies_id };

  return fetch('/api/likes/replies', {
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
      return data.data[0].like_unlike_replies;
  })
  .catch((error) => {
      //displayError(error.error);
      console.error('Erro:', error.error);
  });
}

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
      return data;
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

  if (days > 0) return `há ${days} ${(days === 1 ? 'dia' : 'dias')}`;
  else if (hours > 0) return `há ${hours} ${(hours === 1 ? 'hora' : 'horas')}`;
  else if (minutes > 0) return `${minutes} ${(minutes === 1 ? 'minuto' : 'minutos')}`;
  else return 'agora';
}

function loading(div) {
  const loading = document.createElement('img');
  loading.src = '/assets/images/loading-icon.gif';
  loading.classList.add('loading-icon'); 

  div.appendChild(loading);
}

function loaderr() {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  return loader;
}