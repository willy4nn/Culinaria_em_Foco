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
export { getLogin, getPostById, likePost, favoritePost };