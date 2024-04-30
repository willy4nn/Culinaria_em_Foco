import { getTimeAgo } from "./animation2.js";

async function loadPost(postId) {
    try {
      const [post, isliked, isfavorited] = await Promise.all([
        getPostById(postId),
        getIsLiked(postId),
        getIsFavorited(postId)
      ]);
      return { post, isliked, isfavorited };
    } catch (error) {
      console.error('Erro ao carregar dados da postagem:', error);
    }
}



export { loadPost };

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

async function getIsLiked(posts_id) {

const queryParams = new URLSearchParams({ posts_id }).toString();
console.log("query", queryParams);
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
    console.log("get isliked :", data);
    return data.data;
})
.catch((error) => {
    //displayError(error.error);
    console.error('Erro:', error.error);
});
}

async function getIsFavorited(posts_id) {

const queryParams = new URLSearchParams({ posts_id }).toString();
console.log("query fav", queryParams);
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
    console.log("get isfavorited :", data);
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