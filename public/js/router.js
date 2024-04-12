import main from './pages/main.js';
import login from './pages/login.js';

const router = {
  '/': function () {
    return main();
  },
  '/login': function () {
    return login();
  },
  getPage: function (path) {
    return router[path]();
  },
};

export default router;
