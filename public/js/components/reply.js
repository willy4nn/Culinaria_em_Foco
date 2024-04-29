import { userLogged } from "../pages/refactoringGetPost.js";
import { getTimeAgo, loaderr, loading } from "./animation2.js";


function renderRepliesByCommentId(repliedCommentDiv, repliedCommentId) {
    const newReplies = document.createElement('div');
    const loader = loaderr();
    repliedCommentDiv.appendChild(loader);
 
    getRepliesByCommentId(repliedCommentId)
    .then(data => {
      //commentsList.innerHTML = "";
      data.forEach(async reply => {
  
        const replyIsLiked = await getRepliesIsLiked(reply.id);
        console.log("replyIsLiked", replyIsLiked);
  
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
  
        div.classList.add('comment', 'reply');
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
        if (replyIsLiked) console.log("colorido");
        openReplyTextarea.classList.add('open-reply');

        profilePhoto.src = reply.profile_photo || '../../uploads/profile_photo/default_profile_normal.png';
        name.innerText = reply.name ;
        createdAt.innerText = getTimeAgo(reply.created_at);
        separatorDot.innerText = '·';
        content.innerHTML = reply.content;
  
        likeIcon.innerHTML = 'favorite';
        openReplyTextarea.innerText = 'Reply';
  
        leftHeaderDiv.append(profilePhoto, name, separatorDot, createdAt);
        rightHeaderDiv.append(openReplyTextarea, likeIcon);
  
        headerDiv.append(leftHeaderDiv, rightHeaderDiv);
        div.append(headerDiv, content);

        //repliedCommentDiv.removeChild(loader);
        //repliedCommentDiv.appendChild(div);
        newReplies.appendChild(div);
      });
      repliedCommentDiv.removeChild(loader);
    })

    return newReplies;
}


function handleShowReplies(showRepliesList, openReplyTextarea, commentElement, replyVisibility, comment) {
    let newReplies = document.createElement('div');
    ///div.appendChild(newReplies);
    commentElement.appendChild(newReplies);
    
    // Mostrar respostas
    showRepliesList.addEventListener('click', () => {
        if (newReplies.childNodes.length === 0) {
        newReplies.appendChild(renderRepliesByCommentId(commentElement, comment.id));
        replyVisibility.shownReply = true;
        showArrowIcon.innerText = 'arrow_drop_up';
        } else {
        if (!replyVisibility.shownReply) {
            //newReplies.innerHTML = '';
            //newReplies.appendChild(renderRepliesByCommentId(div, comment.id));
            newReplies.style.display = 'block';

            ////div.appendChild(newReplies);
            replyVisibility.shownReply = true;
            showArrowIcon.innerText = 'arrow_drop_up';
        } else {
            //newReplies.innerHTML = '';
            newReplies.style.display = 'none';

            ////div.removeChild(newReplies)
            replyVisibility.shownReply = false;
            showArrowIcon.innerText = 'arrow_drop_down';
        }
        }
    });

    // Responder um comentário (textarea)
    openReplyTextarea.addEventListener('click', () => {
        if (!replyVisibility.openedReply) {
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

            profilePhoto.src = userLogged.profile_photo || '../../uploads/profile_photo/default_profile_normal.png';
            replyTextarea.placeholder = 'Add a reply';
            buttonCancel.innerText = 'Cancel';
            buttonReply.innerText = 'Reply';

            buttonsDiv.append(buttonCancel, buttonReply);
            contentDiv.append(profilePhoto, replyTextarea);
            
            replyDiv.append(contentDiv, buttonsDiv);
            //div.appendChild(replyDiv);
            div.insertBefore(replyDiv, newReplies);
            commentElement.insertBefore(replyDiv, newReplies);

            replyVisibility.openedReply = true;

            replyTextarea.addEventListener('input', function() {
                replyTextarea.style.height = 'auto'; // Redefine a altura para automática
                replyTextarea.style.height = replyTextarea.scrollHeight + 15 + 'px'; // Ajusta a altura conforme o conteúdo
            });
            buttonCancel.addEventListener('click', () => {
                if (replyVisibility.openedReply) commentElement.removeChild(replyDiv);
                replyVisibility.openedReply = false;
            });
        
            buttonReply.addEventListener('click', () => {
                if (replyTextarea.value.trim().toString() === '') return;
                replyTextarea.disabled = true;
        
                const data = {
                posts_comments_id: comment.id,
                content: replyTextarea.value.trim().toString(),
                }
        
                createReply(data)
                .then(() => {
                replyTextarea.value = '';
                replyTextarea.disabled = false;
                buttonCancel.click();
                replyVisibility.shownReply = false;
                showArrowIcon.innerText = 'arrow_drop_down';
                showRepliesList.click()
                getCommentsByPostId(postId)
                .then(data => {   
                    renderCommentsByPostId(data);
                })
                })
                .catch(error => {
                    console.error('Erro ao buscar post:', error);
                });
            /*  }) */
            });
            

        }
    });  
}

export { renderRepliesByCommentId, handleShowReplies };

/* handleRepliesButtons() {

} */

/* REPLIES */

async function getRepliesByCommentId(id) {
    return fetch('http://localhost:3000/api/replies/search?comments_id=' + id)
    .then((response) => {
        if (response.status !== 200) {
            return response.json().then(errorResponse => {
                throw errorResponse;
            });
        }
        return response.json();
    })
    .then((data) => {
        console.log("get replies :", data);
        return data.data;
    })
    .catch((error) => {
        //displayError(error.error);
        console.error('Erro:', error.error);
    });
}

async function getRepliesIsLiked(replies_id) {

const queryParams = new URLSearchParams({ replies_id }).toString();
console.log("query", queryParams);
return fetch(`http://localhost:3000/api/likes/replies/isliked?${queryParams}`, {
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
    console.log("get replies isliked :", data);
    return data.data[0];
})
.catch((error) => {
    //displayError(error.error);
    console.error('Erro:', error.error);
});
}

async function createReply(data) {
return fetch('http://localhost:3000/api/replies/', {
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
    console.log("create reply:", data);
    return data;
})
.catch((error) => {
    //displayError(error.error);
    console.error('Erro:', error.error);
});
}