import { Aurelia, inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import config from '../globalconfig';

@inject(Aurelia, HttpClient)
export default class AuthService {

    session = null

    // As soon as the AuthService is created, we query local storage to
    // see if the login information has been stored. If so, we immediately
    // load it into the session object on the AuthService.
    constructor(Aurelia, HttpClient) {
        HttpClient.configure(http => {
            http.withHeader('Content-Type', 'application/json');
            http.withBaseUrl(config.baseUrl);
        });

        this.http = HttpClient;
        this.app = Aurelia;

        this.session = JSON.parse(localStorage[config.tokenName] || null);
    }

    login(username, password, errorCallback) {
        var data = {
            username: username,
            password: password,
            clientName: config.clientName
        };

        this.http
            .post(config.loginUrl, data)
            .then((response) => response.content)
            .then((session) => {

                // Save to localStorage
                localStorage[config.tokenName] = JSON.stringify(session);

                // .. and to the session object
                this.session = session;

                if(session.session.portal === 'employee'){
                    var defaultPage = session.clientConfig.defaultLandingPage;
                    var path = defaultPage + '/' + defaultPage;

                    this.app.setRoot('./employee/' + path);
                }else if(session.session.portal === 'broker'){
                }else{
                    // .. and set root to app.
                    this.app.setRoot('./app');
                }

                
            }).catch(err => {
                if(errorCallback){
                    errorCallback({
                        stackTrace: err.response,
                        status: err.statusCode,
                        statusText: err.statusText
                    });
                }
            });
    }

    memberProfile(){
        if(isAuthenticated()){
            return 
        }else{

        }
    }

    logout() {

        // Clear from localStorage
        localStorage[config.tokenName] = null;

        // .. and from the session object
        this.session = null;

        // .. and set root to login.
        this.app.setRoot('./login/login')
    }
    
    isAuthenticated() {
        return this.session !== null;
    }

    can(permission) {
        return true;
    }
}