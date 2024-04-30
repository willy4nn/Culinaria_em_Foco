import { handleShowReplies, renderRepliesByCommentId } from "./reply.js";
import { loaderr, loading } from "./animation2.js";

async function loadComment(postId) {
    try {
      ///loading(commentsList);
      const comments = await getCommentsByPostId(postId);
      const renderedList = renderComments(comments);

      return renderedList;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
}

async function renderComments(comments) {
    //commentsList.innerHTML = "";
    //const commentElementList = [];
    //commentElementList.push(comments.forEach(comment));
    const commentElementListPromises = comments.map(comment);
    const commentElementList = await Promise.all(commentElementListPromises);
    console.log("1111", commentElementList);

    return commentElementList;
}

async function comment(comment) {
    console.log("comment: ", comment);
    ///const commentIsLiked = await getCommentsIsLiked(comment.id);
    ///console.log("commentIsLiked", commentIsLiked);

    const commentElement = document.createElement('div');
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
    const showRepliesList = document.createElement('span');
    const showArrowIcon = document.createElement('span');

    commentElement.classList.add('comment');
    headerDiv.classList.add('comment-header');
    leftHeaderDiv.classList.add('comment-left-header');
    rightHeaderDiv.classList.add('comment-right-header');

    profilePhoto.classList.add('profile-photo');
    name.classList.add('user-name');
    createdAt.classList.add('created-at');
    separatorDot.classList.add('separator-dot');
    content.classList.add('comment-content');

    likeIcon.classList.add('material-symbols-outlined', 'comment-like');
    ///if (commentIsLiked) likeIcon.classList.add('liked');
    ///if (commentIsLiked) console.log("colorido");
    openReplyTextarea.classList.add('open-reply');
    showRepliesList.classList.add('open-reply');
    showArrowIcon.classList.add('material-symbols-outlined', 'arrow-icon');

    profilePhoto.src = comment.profile_photo || '../../uploads/profile_photo/default_profile_normal.png';
    name.innerText = comment.name ;
    createdAt.innerText = getTimeAgo(comment.created_at);
    separatorDot.innerText = '·';
    content.innerHTML = comment.content;

    likeIcon.innerHTML = 'favorite';
    openReplyTextarea.innerText = 'Reply';
    showRepliesList.innerText = `${comment.replies_quantity} replies`
    showArrowIcon.innerText = 'arrow_drop_down';
    showRepliesList.appendChild(showArrowIcon);
    leftHeaderDiv.append(profilePhoto, name, separatorDot, createdAt);
    rightHeaderDiv.append(showRepliesList, openReplyTextarea, likeIcon);

    headerDiv.append(leftHeaderDiv, rightHeaderDiv);
    commentElement.append(headerDiv, content);

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
    
    const replyVisibility = {
        shownReply: false,
        openedReply: false,
    }
    
    
    

    handleShowReplies(showRepliesList, openReplyTextarea, commentElement, replyVisibility, comment);
    

    //commentsList.appendChild(commentElement);
    return commentElement;
}



function renderRepliesByComment(comments) {
    ///commentsList.innerHTML = "";
    ///comments.forEach(renderComment);
}

export { loadComment };



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
        console.log("get comments :", data);
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
    console.log("create comment:", data);
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
    console.log("like comment :", data);
    return data.data[0].like_unlike_comments;
})
.catch((error) => {
    //displayError(error.error);
    console.error('Erro:', error.error);
});
}

async function getCommentsIsLiked(comments_id) {

const queryParams = new URLSearchParams({ comments_id }).toString();
console.log("query", queryParams);
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
    console.log("get comments isliked :", data);
    return data.data[0];
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
