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

export { getCommentsByPostId, createComment, likeComment };