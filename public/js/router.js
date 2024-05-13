import main from './pages/main.js';
import home from './pages/home.js';
import login from './pages/login.js';
import register from './pages/register.js';
import profile from './pages/profile.js';
import createPost from './pages/post.js';
import getPost from './pages/getPost.js';
import editPost from './pages/editPost.js';
import dashboard from './pages/dashboard.js';
import favorites from './pages/favorites.js';
import admin from './pages/admin.js';
import forgotPassword from './pages/forgot-password.js';
import recoveryPassword from './pages/recovery-password.js';
import notFound from './pages/not-found.js';
import create from './pages/create.js';

const router = {
  '': function () {
    return main();
  },
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
    return recoveryPassword(params.token);
  },
  '/home': function () {
    return home();
  },
  '/post': function () {
    return createPost();
  },
  '/create': function () {
    return create();
  },
  '/post/:id': function (params) {
    return getPost(params.id);
  },
  '/post/edit/:id': function (params) {
    return editPost(params.id);
  },
  '/dashboard': function () {
    return dashboard();
  },
  '/favorites': function () {
    return favorites();
  },
  '/profile': function () {
    return profile();
  },
  '/admin': function () {
    return admin();
  },

  // Adicione uma rota para lidar com páginas não encontradas
  '*': function () {
    return notFound();
  },

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
    // Verifica se a função associada à rota existe
    if (typeof router[path] === 'function') {
      // Se existir, chama a função associada à rota
      return router[path]();
    } else {
      // Se não existir, redireciona para a página 404
      return router['*'](); // Ou qualquer função que você tenha definido para a página 404
    }
  },
};

export default router;
