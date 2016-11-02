import { inject } from 'aurelia-framework';
import AuthService from '../login/AuthService';
import {Redirect} from 'aurelia-router';

@inject(AuthService)
export class Employee {
  constructor(AuthService) {
    this.auth = AuthService;
  }
  configureRouter(config, router) {
    this.router = router;

    config.title = 'CXA';
    // remove hash from URL
    // config.options.pushState = true;
    // custom base tag
    // config.options.root = '/';
    config.map([
        { route: 'dashboard', name: 'dashboard', title: 'Dashboard', moduleId: 'employee/dashboard/dashboard', nav: true, settings: {'auth': true} }
    ]);

    config.addAuthorizeStep(AuthorizeStep);
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      var isLoggedIn = this.auth.isAuthenticated();
      if (!isLoggedIn) {
        return next.cancel(new Redirect('login'));
      }
    }

    return next();
  }
}