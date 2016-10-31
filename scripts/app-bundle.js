define('app',['exports', 'aurelia-router'], function (exports, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config) {
      config.title = 'Aurelia';
      config.addPipelineStep('authorize', AuthorizeStep);
      config.map([{ route: ['welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome' }, { route: 'flickr', name: 'flickr', moduleId: 'flickr', nav: true, auth: true }, { route: 'child-router', name: 'childRouter', moduleId: 'child-router', nav: true, title: 'Child Router' }, { route: 'login', name: 'login', moduleId: 'model/login/index', layoutView: 'views/login/login.html' }, { route: '', redirect: 'welcome' }]);
    };

    return App;
  }();

  var AuthorizeStep = function () {
    function AuthorizeStep() {
      _classCallCheck(this, AuthorizeStep);
    }

    AuthorizeStep.prototype.run = function run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.auth;
      })) {
        var isLoggedIn = AuthorizeStep.isLogin();
        if (!isLoggedIn) {
          return next.cancel(new _aureliaRouter.Redirect('login'));
        }
      }

      return next();
    };

    AuthorizeStep.isLoggedIn = function isLoggedIn() {
      var auth_token = localStorage.getItem("auth_token");
      return typeof auth_token !== "undefined" && auth_token !== null;
    };

    return AuthorizeStep;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('model/login/login',[], function () {});
define('model/login/index',[], function () {});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!views/login/login.html', ['module'], function(module) { module.exports = "Login page"; });
//# sourceMappingURL=app-bundle.js.map