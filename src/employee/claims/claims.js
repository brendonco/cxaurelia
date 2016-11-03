export class Claims{
    constructor() {
        
    }
    configureRouter(config, router) {
        this.router = router;

        config.title = 'Claims';
        // remove hash from URL
        // config.options.pushState = true;
        // custom base tag
        // config.options.root = '/';
        config.map([
                { route: ['', 'accounts-claims'], name: 'accounts-claims', title: 'Accounts', moduleId: 'employee/claims/accounts-claims', nav: true, settings: {auth: true} },
                { route: 'submit-claims', name: 'submit-claims', title: 'Submit Claims', moduleId: 'employee/claims/submit-claims', nav: true, settings: {auth: true} },
                { route: 'pending-claims', name: 'pending-claims', title: 'Pending Claims', moduleId: 'employee/claims/pending-claims', nav: true, settings: {auth: true} },
                { route: 'history-claims', name: 'history-claims', title: 'Claims History', moduleId: 'employee/claims/history-claims', nav: true, settings: {auth: true} }
        ]);
  }
}