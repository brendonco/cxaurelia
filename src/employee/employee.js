// import { inject } from 'aurelia-framework';
// import AuthService from '../login/AuthService';
// import {Redirect} from 'aurelia-router';

// @inject(AuthService)
// export class Employee {
//   constructor(AuthService) {
//     this.auth = AuthService;
//   }
//   configureRouter(config, router) {
//     this.router = router;

//     config.title = 'CXA';
//     // remove hash from URL
//     // config.options.pushState = true;
//     // custom base tag
//     // config.options.root = '/';
//     config.map([
//         { route: 'dashboard', name: 'dashboard', title: 'Dashboard', moduleId: 'employee/dashboard/dashboard', nav: true, settings: {'auth': true} }
//     ]);

//     config.addAuthorizeStep(AuthorizeStep);
//   }
// }

// class AuthorizeStep {
//   run(navigationInstruction, next) {
//     if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
//       var isLoggedIn = this.auth.isAuthenticated();
//       if (!isLoggedIn) {
//         return next.cancel(new Redirect('login'));
//       }
//     }

//     return next();
//   }
// }

import AuthService from '../login/AuthService';
import { inject } from 'aurelia-framework';

@inject(AuthService)
export class Dashboard {
  constructor(AuthService) {
    this.auth = AuthService;
    this.profile = this.auth.getEmployeeProfile();
  }

  configureRouter(config, router) {
    this.router = router;

    config.title = 'Member';
    // remove hash from URL
    // config.options.pushState = true;
    // custom base tag
    // config.options.root = '/';
    config.map([
            { route: ['', 'dashboard'], name: 'dashboard', title: 'Home', moduleId: 'employee/dashboard/dashboard', nav: true, settings: {auth: true} },
            { route: 'wellness', name: 'wellness', title: 'Wellness', moduleId: 'employee/wellness/wellness', nav: true, settings: {auth: true} },
            { route: 'claims', name: 'claims', title: 'My Claims', moduleId: 'employee/claims/claims', nav: true, settings: {auth: true} }
        ]);
    // this.router.configure((config)=> {
    //     config.map([
    //         { route: 'dashboard', name: 'dashboard', title: 'Dashboard', moduleId: 'employee/dashboard/dashboard', nav: true, settings: {auth: true, isActive: true} },
    //         { route: 'wellness', name: 'wellness', title: 'Wellness', moduleId: 'employee/wellness/wellness', nav: true, settings: {auth: true} }
    //     ]);
    // });
  }
}
