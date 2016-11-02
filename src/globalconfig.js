var clientName = window.location.pathname.substring(1);

export default {
    baseUrl: 'http://localhost:8080/',
    loginUrl: 'api/1/user/login',
    tokenName: 'ah12h3',
    clientName: clientName
};