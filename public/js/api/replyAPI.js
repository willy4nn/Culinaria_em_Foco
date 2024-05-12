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
        console.log("get replies :", data);
        return data.data;
    })
    .catch((error) => {
        //displayError(error.error);
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
      console.log("create reply:", data);
        return data.data[0].create_reply;
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
      console.log("like post :", data);
        return data.data[0].like_unlike_replies;
    })
    .catch((error) => {
        //displayError(error.error);
        console.error('Erro:', error.error);
    });
}



export { getRepliesByCommentId, createReply, likeReply };