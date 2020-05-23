import auth0 from 'auth0-js';
import {authConfig} from './config';
import * as axios from "axios";
import {baseUrl} from './config'

export default class Auth {
    accessToken = localStorage.getItem('accessToken');
    idToken = localStorage.getItem('idToken');
    expiresAt = localStorage.getItem('expiresAt');
    is_loggedIn = localStorage.getItem('isLoggedIn') || false;
    user;

    auth0 = new auth0.WebAuth({
        domain: authConfig.domain,
        clientID: authConfig.clientId,
        redirectUri: authConfig.callbackUrl,
        responseType: 'token id_token',
        scope: 'openid'
    });

    constructor(history) {
        this.history = history
        try{
            this.user = JSON.parse(localStorage.getItem('user'))
        }finally {}
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getIdToken = this.getIdToken.bind(this);
        this.renewSession = this.renewSession.bind(this);
    }

    login() {
        this.auth0.authorize();
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                console.log('Access token: ', authResult.accessToken)
                console.log('id token: ', authResult.idToken)
                this.setSession(authResult);
            } else if (err) {
                this.history.replace('/');
                console.log(err);
                alert(`Error: ${err.error}. Check the console for further details.`);
            }
        });
    }

    getAccessToken() {
        return this.accessToken;
    }

    getIdToken() {
        return this.idToken;
    }

    async setSession(authResult) {
        // Set isLoggedIn flag in localStorage
        this.is_loggedIn = true;

        // Set the time that the access token will expire at
        let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
        this.accessToken = authResult.accessToken;
        this.idToken = authResult.idToken;
        this.expiresAt = expiresAt;

        localStorage.setItem('expiresAt', this.expiresAt);
        localStorage.setItem('accessToken', this.accessToken);
        localStorage.setItem('idToken', this.idToken);
        localStorage.setItem('isLoggedIn', 'true');

        try {
            const res = await axios.get(baseUrl + '/profile', {headers: {'Authorization': 'Bearer ' + this.idToken}})
            this.user = res.data[0]
            localStorage.setItem('user', JSON.stringify(this.user));
        }finally {
            this.history.replace('/createProfile')
        }

        // navigate to the home route
        this.history.replace('/');
    }

    renewSession() {
        this.auth0.checkSession({}, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                this.logout();
                console.log(err);
                alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
            }
        });
    }

    logout() {
        // Remove tokens and expiry time
        this.accessToken = null;
        this.idToken = null;
        this.expiresAt = 0;

        // Remove isLoggedIn flag from localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('expiresAt');
        this.is_loggedIn = false;

        this.auth0.logout({
            return_to: window.location.origin
        });

        // navigate to the home route
        this.history.replace('/');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = this.expiresAt;
        return new Date().getTime() < expiresAt;
    }
}