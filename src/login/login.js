import { inject } from 'aurelia-framework';
import AuthService from './AuthService';
import Spinner from 'resources/spinner';

@inject(Spinner, AuthService)
export class Login {

    constructor(Spinner, AuthService) {
        this.spinner = Spinner;

        // Or, if we want to add additional logic to the function, 
        // we can call it within another method on our view model.
        this.login = () => {
            if (this.username && this.password) {
                Spinner.on();
                AuthService.login(this.username, this.password, success => {
                    Spinner.off();
                }, err => {
                    this.error = err;
                    Spinner.off();
                });
            } else {
                Spinner.off();
                this.error = {
                    code: 'cxa-001',
                    message: 'Please enter a username and password.'
                };
            }
        }
    }

    activate() {
        this.username = '';
        this.password = '';
        this.error = '';
    }
}
