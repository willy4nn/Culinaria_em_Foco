import createCustomEvent from '../eventModule.js';
import header from './elements/header.js';
import footer from './elements/footer.js';

import { modalError } from './elements/modalError.js';
import { dateFormat } from '../utils/dateFormat.js';
import { loadComments, mainCommentTextarea } from '../components/comment.js';
import { favoritePost, getLogin, getPostById, likePost } from '../api/getPostAPI.js';
import { createComment } from '../api/commentAPI.js';

let userLogged;

// Exporta a função que retorna a página de login
export default function refactGetPost(postId) {
  // HTML do elemento de login
  const getPostContentHTML = `

    <main class=""> 

      <div id="container">
        <!-- <div id="buttons-temp">
          <button id="button-get">Buscar</button>
          <input id="input-id" placeholder="ID do Post"></input>
        </div> 
        </br> -->

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
          <!-- append mainCommentTextarea -->

          <div id="comments-list">
          </div>

        </div>

      </div>

    </main>

  `;

  const getPostElement = document.createElement('div');
  getPostElement.classList.add('create-post-element');
  getPostElement.innerHTML = getPostContentHTML;

  //Adiciona os elementos footer e header
  const main = getPostElement.querySelector("main") 
  getPostElement.insertBefore(header(), main)
  getPostElement.append(footer())
  const { popupCard, showPopup } = modalError();
  //main.appendChild(popupCard);
  main.insertAdjacentElement("afterend", popupCard);
  
  const newsContainer = getPostElement.querySelector('#news-container');
  const newsBody = getPostElement.querySelector('#news-body');

  const newsInteractionButtons = getPostElement.querySelector('#news-interaction-buttons');
  const likesQuantity = getPostElement.querySelector('#likes-quantity');
  const buttonLike = getPostElement.querySelector('#like-button');
  const buttonFavorite = getPostElement.querySelector('#favorite-button');
  const likeIcon = getPostElement.querySelector('#like-icon');
  const favoriteIcon = getPostElement.querySelector('#favorite-icon');

  const commentsContainer = getPostElement.querySelector('#comments-container');
  const commentEditor = mainCommentTextarea();
  commentsContainer.insertBefore(commentEditor, commentsContainer.firstChild);

  const commentTextarea = getPostElement.querySelector('#comment-textarea');
  const buttonsContainer = getPostElement.querySelector('#buttons-container');
  const buttonCancel = getPostElement.querySelector('#cancel-button');
  const buttonComment = getPostElement.querySelector('#comment-button');
  const commentsList = getPostElement.querySelector('#comments-list');

  // Carrega os dados do usuário logado
  getLogin()
  .then(userData => {
    userLogged = userData;
  })
  .catch(error => {
    console.error("Erro ao carregar dados do usuário logado: ", error);
  });

  getPostById(postId)
  .then(post => {
    console.log("getPostById", post);

    const title = document.createElement('h1');
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
    createdAtPost.classList.add('post-created-at');
    content.classList.add('post-text-content');

    div.appendChild(createdAtPost)
    newsBody.append(title, banner, content, div);

    let liked = post.is_liked ? true : false;
    let favorited = post.is_favorited ? true : false;

    if (liked) likeIcon.classList.add('liked');
    likesQuantity.innerText = post.likes_quantity > 1 ? `${post.likes_quantity} curtidas` : `${post.likes_quantity} curtida`;
    
    if (favorited) {
      favoriteIcon.innerText = 'bookmark_added';
      favoriteIcon.classList.add('favorited');
    }

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
      console.log("newfavorited", newFavorited);

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
      console.log("create comment data", data);
      createComment(data).then(() => {
        commentsList.innerHTML = "";
        loadComments(postId).then(data => data.forEach(comment => commentsList.appendChild(comment)));
      })
      .catch(error => {
        console.error('Erro ao recarregar comentários:', error);
      });

    });

  })
  .catch(error => {
    console.error('Erro ao carregar dados página:', error);
  });

  // Carrega a sessão de comentários
  loadComments(postId).then(data => data.forEach(comment => commentsList.appendChild(comment)));

  return getPostElement;
}

export { userLogged };
