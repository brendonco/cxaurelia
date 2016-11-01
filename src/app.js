import { inject } from 'aurelia-framework';
import AuthService from './login/AuthService';
import {Redirect} from 'aurelia-router';

@inject(AuthService)
export class App {
  constructor(AuthService) {
    this.auth = AuthService;
  }
  configureRouter(config, router) {
    config.addAuthorizeStep(AuthorizeStep);
    config.map([
      { route: ['', 'login'],       name: 'login',       moduleId: 'login/login' },
      { route: 'dashboard',            name: 'dashboard',      moduleId: 'dashboard/dashboard', settings: { auth: true } }
    ]);
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      var isLoggedIn = AuthorizeStep.isAuthenticated();// insert magic here;
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}