const axios = require("axios");
const API_BASE = 'someAPIAddress/route/one/'

/**
 * This class provides a way to make API calls using axios, a npm library
 * Info can be found here: https://axios-http.com/docs/intro
 * and
 * https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/#postjson
 */
class DatabaseService {
    constructor() {
        // Add instance variables here
        this.authenticationToken = '123456';
    }
    
    authenticateUser(user, pass) {
        return axios({
            method: 'POST',
            url: API_BASE + 'Users/authenticate',
            data: {
                'username': user,
                'password': pass
            }
        });
    }

    pingDatabaseService() {
        return 'DatabaseService successfully pinged!';
    }

    setToken(token) {
        this.authenticationToken = token;
    }

    getToken() {
        return this.authenticationToken;
    }
}

// This exports the whole class to create instances in other classes.
module.exports = DatabaseService;