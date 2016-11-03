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
      this.router = router;

      config.title = 'CXA';

      config.map([{ route: ['', 'login'], name: 'login', moduleId: 'login/login', nav: false, title: 'Login', settings: { auth: true } }]);

      config.mapUnknownRoutes('login/login');
    };

    return App;
  }()) || _class);
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
    var clientName = window.location.pathname.substring(1);

    exports.default = {
        baseUrl: '',
        loginUrl: 'api/1/user/login',
        tokenName: 'ah12h3',
        clientName: clientName
    };
});
define('main',['exports', './login/AuthService', './environment'], function (exports, _AuthService, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _AuthService2 = _interopRequireDefault(_AuthService);

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
      var auth = aurelia.container.get(_AuthService2.default);

      var root = auth.isAuthenticated() ? 'app' : 'login/login';

      aurelia.setRoot(root);
    });
  }
});
define('employee/employee',['exports', '../login/AuthService', 'aurelia-framework'], function (exports, _AuthService, _aureliaFramework) {
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

  var Dashboard = exports.Dashboard = (_dec = (0, _aureliaFramework.inject)(_AuthService2.default), _dec(_class = function () {
    function Dashboard(AuthService) {
      _classCallCheck(this, Dashboard);

      this.auth = AuthService;
    }

    Dashboard.prototype.configureRouter = function configureRouter(config, router) {
      this.router = router;

      config.title = 'Member';

      config.map([{ route: ['', 'dashboard'], name: 'dashboard', title: 'Home', moduleId: 'employee/dashboard/dashboard', nav: true, settings: { auth: true } }, { route: 'wellness', name: 'wellness', title: 'Wellness', moduleId: 'employee/wellness/wellness', nav: true, settings: { auth: true } }, { route: 'claims', name: 'claims', title: 'My Claims', moduleId: 'employee/claims/claims', nav: true, settings: { auth: true } }]);
    };

    return Dashboard;
  }()) || _class);
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
                http.withHeader('Content-Type', 'application/json');
                http.withBaseUrl(_globalconfig2.default.baseUrl);
            });

            this.http = HttpClient;
            this.app = Aurelia;

            this.session = JSON.parse(localStorage[_globalconfig2.default.tokenName] || null);
        }

        AuthService.prototype.login = function login(username, password, errorCallback) {
            var _this = this;

            var data = {
                username: username,
                password: password,
                clientName: _globalconfig2.default.clientName
            };

            this.http.post(_globalconfig2.default.loginUrl, data).then(function (response) {
                return response.content;
            }).then(function (session) {
                localStorage[_globalconfig2.default.tokenName] = JSON.stringify(session);

                _this.session = session;

                if (session.session.portal === 'employee') {
                    var defaultPage = session.clientConfig.defaultLandingPage;
                    var path = defaultPage + '/' + defaultPage;

                    _this.app.setRoot('./employee/employee');
                } else if (session.session.portal === 'broker') {} else {
                    _this.app.setRoot('./app');
                }
            }).catch(function (err) {
                if (errorCallback) {
                    try {
                        var response = JSON.parse(err.response);
                        errorCallback({
                            stackTrace: err.response,
                            status: err.statusCode,
                            statusText: err.statusText,
                            message: response.message,
                            code: response.code
                        });
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
        };

        AuthService.prototype.logout = function logout() {
            localStorage[_globalconfig2.default.tokenName] = null;

            this.session = null;

            this.app.setRoot('./login/login');
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
          AuthService.login(_this.username, _this.password, function (err) {
            _this.error = err;
          });
        } else {
          _this.error = {
            code: 'cxa-001',
            message: 'Please enter a username and password.'
          };
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
define('employee/claims/accounts-claims',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AccountsClaims = exports.AccountsClaims = function AccountsClaims() {
    _classCallCheck(this, AccountsClaims);
  };
});
define('employee/claims/claims',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Claims = exports.Claims = function () {
        function Claims() {
            _classCallCheck(this, Claims);
        }

        Claims.prototype.configureRouter = function configureRouter(config, router) {
            this.router = router;

            config.title = 'Claims';

            config.map([{ route: ['', 'accounts-claims'], name: 'accounts-claims', title: 'Accounts', moduleId: 'employee/claims/accounts-claims', nav: true, settings: { auth: true } }, { route: 'submit-claims', name: 'submit-claims', title: 'Submit Claims', moduleId: 'employee/claims/submit-claims', nav: true, settings: { auth: true } }, { route: 'pending-claims', name: 'pending-claims', title: 'Pending Claims', moduleId: 'employee/claims/pending-claims', nav: true, settings: { auth: true } }, { route: 'history-claims', name: 'history-claims', title: 'Claims History', moduleId: 'employee/claims/history-claims', nav: true, settings: { auth: true } }]);
        };

        return Claims;
    }();
});
define('employee/claims/history-claims',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var HistoryClaims = exports.HistoryClaims = function HistoryClaims() {
        _classCallCheck(this, HistoryClaims);
    };
});
define('employee/claims/pending-claims',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var PendingClaims = exports.PendingClaims = function PendingClaims() {
        _classCallCheck(this, PendingClaims);
    };
});
define('employee/claims/submit-claims',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SubmitClaims = exports.SubmitClaims = function SubmitClaims() {
        _classCallCheck(this, SubmitClaims);
    };
});
define('employee/dashboard/dashboard',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Dashboard = exports.Dashboard = function Dashboard() {
        _classCallCheck(this, Dashboard);
    };
});
define('employee/wellness/wellness',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Wellness = exports.Wellness = function Wellness() {
        _classCallCheck(this, Wellness);
    };
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n    <router-view></router-view>\n</template>\n"; });
define('text!employee/employee.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"employee/components/navigation.html\"></require>\n    <div class=\"container\">\n        <!-- Static navbar -->\n        <nav class=\"navbar navbar-default\">\n            <div class=\"container-fluid\">\n                <div class=\"navbar-header\">\n                    <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n                        <span class=\"sr-only\">Toggle navigation</span>\n                        <span class=\"icon-bar\"></span>\n                        <span class=\"icon-bar\"></span>\n                        <span class=\"icon-bar\"></span>\n                    </button>\n                    <a class=\"navbar-brand\" href=\"#\">CXA</a>\n                </div>\n                <div id=\"navbar\" class=\"navbar-collapse collapse\">\n                    <navigation router.bind=\"router\"></navigation>\n                    <ul class=\"nav navbar-nav navbar-right\">\n                        <!-- We can call the logout() method directly on the object. -->\n                        <li><a href=\"#\" click.delegate=\"auth.logout()\">Log Out</a></li>\n                    </ul>\n                </div>\n                <!--/.nav-collapse -->\n            </div>\n            <!--/.container-fluid -->\n        </nav>\n        <div class=\"page-host\">\n            <router-view></router-view>\n        </div>\n    </div>\n</template>\n"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"bootstrap/css/bootstrap.css\"></require>\n    <form class=\"login-form\" submit.delegate=\"login()\">\n        <div class=\"panel panel-default\">\n            <div class=\"panel-body\">\n                <input class=\"form-control\" type=\"text\" placeholder=\"username\" value.bind=\"username\" />\n                <input class=\"form-control\" type=\"password\" placeholder=\"password\" value.bind=\"password\" />\n                <button class=\"btn btn-default pull-right\" type=\"submit\">Login</button>\n            </div>\n        </div>\n    </form>\n    <div class=\"text-danger\" if.bind=\"error\">\n        <p>Error Code: ${error.code}</p>\n        <p>Error: ${error.message}</p>\n    </div>\n</template>\n"; });
define('text!employee/claims/accounts-claims.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-body\">Accounts</div>\n    </div>\n</template>\n"; });
define('text!../style/main.css', ['module'], function(module) { module.exports = "* {\n  margin: 0;\n  padding: 0;\n  -webkit-box-sizing: border-box;\n     -moz-box-sizing: border-box;\n          box-sizing: border-box; }\n\nbody {\n  padding: 1em; }\n\n.page-host {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n     -moz-box-orient: vertical;\n     -moz-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column; }\n\n.secondary-navigation:active {\n  color: #FFF; }\n\n.secondary-navigation ul {\n  color: #333;\n  background-color: #e7e7e7; }\n\n.secondary-navigation nav {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: flex; }\n\n/*# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jc3MiLCJzb3VyY2VzIjpbInN0eWxlL21haW4uc2NzcyIsInN0eWxlL19nbG9iYWwuc2NzcyIsInN0eWxlL19uYXZpZ2F0aW9uLnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAnZ2xvYmFsJztcbkBpbXBvcnQgJ25hdmlnYXRpb24nOyIsIioge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmJvZHkge1xuICBwYWRkaW5nOiAxZW07XG59XG5cbi5wYWdlLWhvc3R7XG4gICAgZGlzcGxheTpmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG59IiwiJG1lbnUtYmctY29sb3I6ICNlN2U3ZTc7XG5cbi5zZWNvbmRhcnktbmF2aWdhdGlvbntcbiAgICAmOmFjdGl2ZXtcbiAgICAgICAgY29sb3I6ICNGRkY7XG4gICAgfVxuXG4gICAgdWwge1xuICAgICAgICBjb2xvcjogIzMzMztcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJG1lbnUtYmctY29sb3I7XG4gICAgfVxuXG4gICAgbmF2IHtcbiAgICAgICAgZGlzcGxheTpmbGV4O1xuICAgIH1cbn0iXSwibWFwcGluZ3MiOiJBQ0FBLEFBQUEsQ0FBQyxDQUFDO0VBQ0EsTUFBTSxFQUFFLENBQUU7RUFDVixPQUFPLEVBQUUsQ0FBRTtFQUNYLFVBQVUsRUFBRSxVQUFXLEdBQ3hCOztBQUVELEFBQUEsSUFBSSxDQUFDO0VBQ0gsT0FBTyxFQUFFLEdBQUksR0FDZDs7QUFFRCxBQUFBLFVBQVUsQ0FBQTtFQUNOLE9BQU8sRUFBQyxJQUFLO0VBQ2IsY0FBYyxFQUFFLE1BQU8sR0FDMUI7O0FDWEQsQUFBQSxxQkFBcUIsQUFDaEIsT0FBTyxDQUFBO0VBQ0osS0FBSyxFQUFFLElBQUssR0FDZjs7QUFITCxBQUtJLHFCQUxpQixDQUtqQixFQUFFLENBQUM7RUFDQyxLQUFLLEVBQUUsSUFBSztFQUNaLGdCQUFnQixFQVRSLE9BQU8sR0FVbEI7O0FBUkwsQUFVSSxxQkFWaUIsQ0FVakIsR0FBRyxDQUFDO0VBQ0EsT0FBTyxFQUFDLElBQUssR0FDaEIiLCJuYW1lcyI6W119 */\n"; });
define('text!employee/claims/claims.html', ['module'], function(module) { module.exports = "<template>\n    <require from=\"employee/components/navigation.html\"></require>\n    <navigation router.bind=\"router\" class=\"secondary-navigation\"></navigation>\n    <div class=\"page-host\">\n        <router-view></router-view>\n    </div>\n</template>"; });
define('text!employee/claims/history-claims.html', ['module'], function(module) { module.exports = "<template>\n    History Claims\n</template>"; });
define('text!employee/claims/pending-claims.html', ['module'], function(module) { module.exports = "<template>\n    Pending Claims\n</template>"; });
define('text!employee/claims/submit-claims.html', ['module'], function(module) { module.exports = "<template>\n    Submit Claims\n</template>"; });
define('text!employee/components/navigation.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav>\n    <ul class=\"nav navbar-nav\">\n        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n            <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n    </ul>\n  </nav>\n</template>\n"; });
define('text!employee/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n<!--   <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n        <div class=\"navbar-header\">\n          <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n            <span class=\"sr-only\">Toggle Navigation</span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n            <span class=\"icon-bar\"></span>\n          </button>\n          <a class=\"navbar-brand\" href=\"#\">\n            <i class=\"fa fa-home\"></i>\n            <span>CXA</span>\n          </a>\n        </div>\n\n        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n          <ul class=\"nav navbar-nav navbar-right\">\n            <li><a href=\"#\" click.delegate=\"auth.logout()\">Log Out</a></li>\n          </ul>\n        </div>\n  </nav>\n\n  <div class=\"page-host\">\n      <section>\n        <h1>User Object</h1>\n        <h2>IsAuthenticated?</h2>\n        <div>${auth.isAuthenticated()}</div>\n      </section>\n  </div> -->\n\n\n  Dashboard\n</template>"; });
define('text!employee/wellness/wellness.html', ['module'], function(module) { module.exports = "<template>\n    Wellness Page    \n</template>"; });
//# sourceMappingURL=app-bundle.js.map