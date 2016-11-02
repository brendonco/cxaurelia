import { inject } from 'aurelia-framework';
import AuthService from './login/AuthService';
import {Redirect} from 'aurelia-router';

@inject(AuthService)
export class App {
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
    // config.addAuthorizeStep(AuthorizeStep);
    config.map([
      { route: ['', 'login'], name: 'login',     moduleId: 'login/login', nav: false,  title: 'Login', settings: {auth: true}}
    ]);

    config.mapUnknownRoutes('login/login');
  }
}