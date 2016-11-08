import { inject } from 'aurelia-framework';
import AuthService from './login/AuthService';
import {Redirect} from 'aurelia-router';
import config from './globalconfig';

@inject(AuthService)
export class App {
  constructor(AuthService) {
    this.auth = AuthService;
  }
  configureRouter(config, router) {
    this.router = router;

    config.title = 'CXA';
    // remove hash from URL
    config.options.pushState = true;
    // custom base tag
    config.options.root = '/' + config.clientName;
    // config.addAuthorizeStep(AuthorizeStep);
    config.map([
      { route: ['', 'login'], name: 'login',     moduleId: 'login/login', nav: true,  title: 'Login', settings: {auth: false}},
      { route: 'contact', name: 'contact',     moduleId: 'contact/contact', nav: true,  title: 'Contact', settings: {auth: false}}
    ]);

    config.mapUnknownRoutes('login/login');
  }
}