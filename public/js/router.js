import main from './pages/main.js';
import login from './pages/login.js';
import home from './pages/home.js';
import register from './pages/register.js';
import createPost from './pages/post.js';
import displayNews from './pages/latest-news.js';

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
  '/home': function () {
    return home();
  },
  '/post': function () {
    return createPost();
  },
  '/latest-news': function () {
    return displayNews();
  },
  getPage: function (path) {
    return router[path]();
  },
};

export default router;
