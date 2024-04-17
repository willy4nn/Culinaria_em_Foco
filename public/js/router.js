import main from './pages/main.js';
import login from './pages/login.js';
import home from './pages/home.js';
import createPost from './pages/post.js';

const router = {
  '/': function () {
    return main();
  },
  '/login': function () {
    return login();
  },
  '/home': function () {
    return home();
  },
  '/post': function () {
    return createPost();
  },
  getPage: function (path) {
    return router[path]();
  },
};

export default router;
