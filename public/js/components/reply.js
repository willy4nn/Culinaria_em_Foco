import { getRepliesByCommentId, likeReply } from "../api/replyAPI.js";
import { getTimeAgo, loaderr } from "../utils/animation.js";

// Solicita a requisição de respostas, envelopa o resultado em um container e lida a animação de loading
async function loadRepliesByCommentId(repliedCommentDiv, repliedCommentId) {
    console.log("redpliedcommentdiv 2", repliedCommentDiv)
    const newReplies = document.createElement('div');
    const loader = loaderr();
    repliedCommentDiv.appendChild(loader);
    
    const repliesloaded = await loadReplies(repliedCommentId, repliedCommentDiv);
    console.log("repliesloaded", repliesloaded);
    repliesloaded.forEach(reply => newReplies.appendChild(reply));

    repliedCommentDiv.removeChild(loader);
    return newReplies;
}

// Faz a requisição das respostas com base no Id do comentário e repassa para o render
async function loadReplies(repliedCommentId, repliedCommentDiv) {
    try {
        ///loading(commentsList);
        const replies = await getRepliesByCommentId(repliedCommentId);

        const replyElementListPromises = replies.map(reply => renderReply(reply, repliedCommentDiv));
        const replyElementList = await Promise.all(replyElementListPromises);
        
        return replyElementList;
    } catch (error) {
        console.error('Erro ao buscar repostas do comentário:', error);
    }
}

// Cria o elemento de cada reposta individualmente e retornar pro loadReplies
async function renderReply(reply, repliedCommentDiv) {
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
    if (reply.is_liked) likeIcon.classList.add('liked');
    if (reply.is_liked) console.log("colorido");
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
        console.log("new",newLiked);
        
        const cleanResult = newLiked.substring(1, newLiked.length - 1);
        const values = cleanResult.split(',');
        const isLiked = values[1].trim() === 't' ? true : false;

        console.log("newliked", cleanResult, isLiked);

        if (isLiked) likeIcon.classList.add('liked');
        else likeIcon.classList.remove('liked');
    });

    console.log("repliedCommentDiv:", repliedCommentDiv);
    const replyButton = repliedCommentDiv.querySelector('.open-reply');
    openReplyReplyTextarea.addEventListener('click', () => replyButton.click());

    return newDiv;
}

export { loadRepliesByCommentId, loadReplies, renderReply };