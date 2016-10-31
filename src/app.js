import {Redirect} from 'aurelia-router';

export class App {
  // constructor() {
  //   this.message = 'Hello World!';
  // }
  configureRouter(config) {
    config.title = 'Aurelia';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['welcome'],    name: 'welcome',       moduleId: 'welcome',      nav: true, title:'Welcome' },
      { route: 'flickr',       name: 'flickr',        moduleId: 'flickr',       nav: true, auth: true },
      { route: 'child-router', name: 'childRouter',   moduleId: 'child-router', nav: true, title:'Child Router' },
      { route: 'login', name: 'login', moduleId: 'model/login/index', layoutView: 'views/login/login.html' },
      { route: '', redirect: 'welcome' }
    ]);
  }
}


class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      var isLoggedIn = AuthorizeStep.isLogin();//false;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }

  static isLoggedIn(): boolean {
    var auth_token = localStorage.getItem("auth_token");
    return (typeof auth_token !== "undefined" && auth_token !== null);
  }
}