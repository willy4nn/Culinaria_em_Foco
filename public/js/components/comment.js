import { getCommentsByPostId, likeComment } from "../api/commentAPI.js";
import { createReply } from "../api/replyAPI.js";
import { userLogged } from "../pages/getPost.js";
import getTimeAgo from "../utils/getTimeAgo.js";
import { loadRepliesByCommentId, renderReply } from "./reply.js";

// Textarea padrão de comentário
function mainCommentTextarea() {
    /* DECLARAÇÃO */
    const commentEditor = document.createElement('div');

    const inputContainer = document.createElement('div');
    const commentTextarea = document.createElement('textarea');

    const buttonsContainer = document.createElement('div');
    const cancelButton = document.createElement('button');
    const commentButton = document.createElement('button');

    commentEditor.id = 'comment-editor';

    inputContainer.id = 'input-container';
    commentTextarea.id = 'comment-textarea';

    buttonsContainer.id = 'buttons-container';
    cancelButton.id = 'cancel-button';
    commentButton.id = 'comment-button';

    commentTextarea.classList.add('paragraph-normal');
    cancelButton.classList.add('comment-button', 'button-fill-cancel');
    commentButton.classList.add('comment-button', 'button-fill');

    commentTextarea.placeholder = 'Adicionar comentário';
    commentTextarea.rows = '1';

    cancelButton.innerText = 'Canceler';
    commentButton.innerText = 'Comentar';

    inputContainer.appendChild(commentTextarea);
    buttonsContainer.append(cancelButton, commentButton);

    commentEditor.append(inputContainer, buttonsContainer);

    /* ANIMAÇÕES E CUSTOMIZAÇÃO */
    commentEditor.addEventListener('click', function() {
        buttonsContainer.style.display = 'flex';
        commentEditor.style.border = 'solid 1px #909090';
        commentTextarea.placeholder = '';
        commentTextarea.style.height = 'auto';
        commentTextarea.style.height = commentTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
        commentTextarea.focus();
    });

    cancelButton.addEventListener('click', function(e) {
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

    return commentEditor;
}

// Faz a requisição dos comentários por ID do post e repassa pro renderComment
async function loadComments(postId) {
    // Busca todos os comentários
    const comments = await getCommentsByPostId(postId);

    // Renderiza cada um individualmente e salva em um array
    const commentElementListPromises = comments.map(renderComment);
    const commentElementList = await Promise.all(commentElementListPromises);

    return commentElementList;
}

// Cria o elemento de cada comentário individualmente e retornar pro loadComments
async function renderComment(comment) {
    /* DECLARAÇÃO */
    //const commentIsLiked = await getCommentsIsLiked(comment.id);
    //console.log("commentIsLiked", commentIsLiked);
    console.log("replies qty", comment.replies_quantity);

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
    if (comment.is_liked) likeIcon.classList.add('liked');
    if (comment.is_liked) console.log("colorido");
    openReplyTextarea.classList.add('open-reply');
    showRepliesButton.classList.add('show-reply');
    showRepliesNumber.classList.add('reply-quantity');
    showArrowIcon.classList.add('material-symbols-outlined', 'arrow-icon');

    profilePhoto.src = comment.profile_photo || '../../uploads/profile_photo/default_profile_normal.png';
    name.innerText = comment.name ;
    name.title = comment.name;
    createdAt.innerText = getTimeAgo(comment.created_at);
    separatorDot.innerText = '·';
    content.innerHTML = comment.content;

    likeIcon.innerHTML = 'favorite';
    openReplyTextarea.innerText = 'Responder';
    //showRepliesButton.innerText = `${comment.replies_quantity} replies`
    showRepliesNumber.innerText = comment.replies_quantity
    showRepliesComplement.innerText = comment.replies_quantity > 1 ? 'repostas' : 'reposta';
    console.log("sssss",showRepliesComplement.innerText);
    showArrowIcon.innerText = 'arrow_drop_down';
    
    showRepliesButton.append(showArrowIcon, showRepliesNumber, showRepliesComplement);
    leftHeaderDiv.append(profilePhoto, name, separatorDot, createdAt);
    rightHeaderDiv.append(showRepliesButton, openReplyTextarea, likeIcon);

    headerDiv.append(leftHeaderDiv, rightHeaderDiv);
    div.append(headerDiv, content);


    /* INTERAÇÃO */
    
    // Efetuar like no comentário
    likeIcon.addEventListener('click', async () => {
        const newLiked = await likeComment(comment.id);
        
        const cleanResult = newLiked.substring(1, newLiked.length - 1);
        const values = cleanResult.split(',');
        const isLiked = values[1].trim() === 't' ? true : false;

        console.log("newliked", newLiked, isLiked);

        if (isLiked) likeIcon.classList.add('liked');
        else likeIcon.classList.remove('liked');
    });


    let shownReply = false;
    let newReplies = document.createElement('div');
    div.appendChild(newReplies);

    // Mostrar respostas, faz a requisição na primeira, oculta/desoculta nas subsequentes
    showRepliesButton.addEventListener('click', async () => {
        if (!shownReply) {
            if (newReplies.childNodes.length === 0) {
                console.log("TESTENOW", div, comment.id);
                shownReply = true;
                newReplies.appendChild( await loadRepliesByCommentId(div, comment.id));
                showArrowIcon.innerText = 'arrow_drop_up';
    
            } else {
                newReplies.style.display = 'block';
                shownReply = true;
                showArrowIcon.innerText = 'arrow_drop_up';
            }

        } else {
            newReplies.style.display = 'none';
            shownReply = false;
            showArrowIcon.innerText = 'arrow_drop_down';
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
            console.log("userlogge", userLogged);
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

                createReply(data).then(async (data) => {
                    if (data) {
                        const response = data.slice(1, -1);
                        const values = response.split(',');
                        const replies_quantity = parseInt(values[0]);
                        const new_reply_id = parseInt(values[1]);

                        dataSuccess.id = new_reply_id;

                        const firstComment = newReplies.firstChild;
                        if (newReplies.childNodes.length > 0) firstComment.insertBefore(await renderReply(dataSuccess, div), firstComment.firstChild);
                
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

    return div;
}

export { mainCommentTextarea, loadComments, renderComment };


  

