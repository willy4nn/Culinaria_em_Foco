import main from './pages/main.js';
import home from './pages/home.js';
import login from './pages/login.js';
import register from './pages/register.js';
import profile from './pages/profile.js';
import createPost from './pages/post.js';
import getPost from './pages/getPost.js';
import editor from './pages/editor.js';
import editPost from './pages/editPost.js';
import dashboard from './pages/dashboard.js';
import favorite from './pages/favorite.js';
import admin from './pages/admin.js';
import forgotPassword from './pages/forgot-password.js';
import recoveryPassword from './pages/recovery-password.js';


const router = {
  '/': function () {
    return main();
  },
  '/login': function () {
    return login();
  },
  '/register': function () {
    return register();
  },
  '/forgot-password': function () {
    return forgotPassword();
  },
  '/recovery-password/:token': function (params) {
    console.log("token", params)
    return recoveryPassword(params.token);
  },
  '/home': function () {
    return home();
  },
  
  '/post': function () {
    return createPost();
  },
  '/post/:id': function (params) {
    console.log("post id", params)
    return getPost(params.id);
  },
  '/post/edit/:id': function (params) {
    console.log("post edit id", params)
    return editPost(params.id);
  },
  '/editor': function () {
    return editor();
  },
  '/dashboard': function () {
    return dashboard();
  },
  '/favorite': function () {
    return favorite();
  },
  '/profile': function () {
    return profile();
  },
  '/admin': function () {
    return admin();
  },
  /* getPage: function (path) {
    // Verifica se a rota possui um parâmetro dinâmico
    const dynamicRoute = Object.keys(router).find(route => {
        const routePattern = new RegExp(`^${route.replace(/:\w+/g, '\\w+')}$`);
        return routePattern.test(path);
    });

    if (dynamicRoute) {
        // Se a rota for dinâmica, extraia o parâmetro e chame a função associada
        const param = path.split('/')[2]; // Extrai o ID da URL (/post/1)
        return router[dynamicRoute]({ id: param }); // Passa o ID como parâmetro
    } else {
        // Se não for uma rota dinâmica, apenas chama a função associada
        return router[path]();
    }
  }, */
  getPage: function (path) {
    // Verifica se a rota é a rota de edição de post
    if (path.startsWith('/post/edit/')) {
      const paramIndex = path.indexOf('/edit/') + 6; // Adiciona o comprimento de '/edit/' para encontrar o início do ID
      const param = path.substring(paramIndex); // Extrai o ID da URL (/post/edit/1)
      return router['/post/edit/:id']({ id: param }); // Passa o ID como parâmetro para a rota de edição
    }

    // Verifica se a rota é a rota de exibição de post
    if (path.startsWith('/post/')) {
      const paramIndex = path.indexOf('/post/') + 6; // Adiciona o comprimento de '/post/' para encontrar o início do ID
      const param = path.substring(paramIndex); // Extrai o ID da URL (/post/1)
      return router['/post/:id']({ id: param }); // Passa o ID como parâmetro para a rota de exibição
    }

    if (path.startsWith('/recovery-password/')) {
      const paramIndex = path.indexOf('/recovery-password/') + 19; // Adiciona o comprimento de '/recovery-password/' para encontrar o início do ID
      const param = path.substring(paramIndex); // Extrai o Token da URL (/recovery-password/token)
      return router['/recovery-password/:token']({ token: param }); // Passa o Token como parâmetro para a rota de exibição
    }

    // Se não for uma rota dinâmica, apenas chama a função associada
    return router[path]();
  },

};

export default router;
