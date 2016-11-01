define('app',['exports', 'aurelia-framework', './login/AuthService', 'aurelia-router'], function (exports, _aureliaFramework, _AuthService, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var _AuthService2 = _interopRequireDefault(_AuthService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_AuthService2.default), _dec(_class = function () {
    function App(AuthService) {
      _classCallCheck(this, App);

      this.auth = AuthService;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.addAuthorizeStep(AuthorizeStep);
      config.map([{ route: ['', 'login'], name: 'login', moduleId: 'login/login' }, { route: 'dashboard', name: 'dashboard', moduleId: 'dashboard/dashboard', settings: { auth: true } }]);
    };

    return App;
  }()) || _class);

  var AuthorizeStep = function () {
    function AuthorizeStep() {
      _classCallCheck(this, AuthorizeStep);
    }

    AuthorizeStep.prototype.run = function run(navigationInstruction, next) {
      if (navigationInstruction.getAllInstructions().some(function (i) {
        return i.config.settings.auth;
      })) {
        var isLoggedIn = AuthorizeStep.isAuthenticated();
        if (!isLoggedIn) {
          return next.cancel(new _aureliaRouter.Redirect('login'));
        }
      }

      return next();
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
define('globalconfig',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = {
        baseUrl: 'http://localhost:8080/',
        loginUrl: 'api/1/user/login',
        tokenName: 'ah12h3'
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
define('login/AuthService',['exports', 'aurelia-framework', 'aurelia-http-client', '../globalconfig'], function (exports, _aureliaFramework, _aureliaHttpClient, _globalconfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;

    var _globalconfig2 = _interopRequireDefault(_globalconfig);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _dec, _class;

    var AuthService = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaHttpClient.HttpClient), _dec(_class = function () {
        function AuthService(Aurelia, HttpClient) {
            _classCallCheck(this, AuthService);

            this.session = null;

            HttpClient.configure(function (http) {
                http.withBaseUrl(_globalconfig2.default.baseUrl);
            });

            this.http = HttpClient;
            this.app = Aurelia;

            this.session = JSON.parse(localStorage[_globalconfig2.default.tokenName] || null);
        }

        AuthService.prototype.login = function login(username, password) {
            var _this = this;

            this.http.post(_globalconfig2.default.loginUrl, { username: username, password: password }).then(function (response) {
                return response.content;
            }).then(function (session) {
                localStorage[_globalconfig2.default.tokenName] = JSON.stringify(session);

                _this.session = session;

                _this.app.setRoot('app');
            });
        };

        AuthService.prototype.logout = function logout() {
            localStorage[_globalconfig2.default.tokenName] = null;

            this.session = null;

            this.app.setRoot('login');
        };

        AuthService.prototype.isAuthenticated = function isAuthenticated() {
            return this.session !== null;
        };

        AuthService.prototype.can = function can(permission) {
            return true;
        };

        return AuthService;
    }()) || _class);
    exports.default = AuthService;
});
define('login/login',['exports', 'aurelia-framework', './AuthService'], function (exports, _aureliaFramework, _AuthService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _AuthService2 = _interopRequireDefault(_AuthService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_AuthService2.default), _dec(_class = function () {
    function Login(AuthService) {
      var _this = this;

      _classCallCheck(this, Login);

      this.login = function () {
        if (_this.username && _this.password) {
          AuthService.login(_this.username, _this.password);
        } else {
          _this.error = 'Please enter a username and password.';
        }
      };
    }

    Login.prototype.activate = function activate() {
      this.username = '';
      this.password = '';
      this.error = '';
    };

    return Login;
  }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('employee/dashboard/dashboard',['exports', '../../login/AuthService', 'bootstrap'], function (exports, _AuthService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Dashboard = undefined;

  var _AuthService2 = _interopRequireDefault(_AuthService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Dashboard = exports.Dashboard = (_dec = inject(_AuthService2.default), _dec(_class = function Dashboard(AuthService) {
    _classCallCheck(this, Dashboard);

    this.auth = AuthService;
  }) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <router-view></router-view>\n</template>\n"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template>\n    <form class=\"login-form\" submit.delegate=\"login()\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n            <input class=\"form-control\" type=\"text\" placeholder=\"username\" value.bind=\"username\" />\n            <input class=\"form-control\" type=\"password\" placeholder=\"password\" value.bind=\"password\" />\n            <button class=\"btn btn-default pull-right\" type=\"submit\">Login</button>\n            <span class=\"text-danger\">${error}</span>\n            </div>\n        </div>\n  </form>\n</template>"; });
define('text!employee/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n        <div class=\"navbar-header\">\n          <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n            <span class=\"sr-only\">Toggle Navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n          </button>\n          <a class=\"navbar-brand\" href=\"#\">\n            <i class=\"fa fa-home\"></i>\n            <span>CXA</span>\n          </a>\n        </div>\n\n        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n          <ul class=\"nav navbar-nav navbar-right\">\n\n            <!-- We can call the logout() method directly on the object. -->\n            <li><a href=\"#\" click.delegate=\"auth.logout()\">Log Out</a></li>\n          </ul>\n        </div>\n  </nav>\n\n  <div class=\"page-host\">\n      <section>\n        <h1>User Object</h1>\n        <h2>IsAuthenticated?</h2>\n        <div>${auth.isAuthenticated()}</div>\n      </section>\n  </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map