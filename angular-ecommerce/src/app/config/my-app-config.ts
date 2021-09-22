export default {

    /*
    clientID >>> public identifier of the client app

    issuer >>> URL when authorizing with Okta Authorization Server

    redirectUri >>> Once user logs in, send them here

    scopes >>> OpenID Connect (OIDC) scopes provide access to information about a user such as name, phone number, email etc. 
               The scope has a set of user attributes know as "claims"

    openid: required for authentication requests

    profile: user's first name, last name phone, etc

    email: user's email address    
    */
    oidc:
    {
        clientId: '0oabnoro3DhhYXIMF5d6',
        issuer: 'https://dev-94708540.okta.com/oauth2/default',
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'email', 'profile']
    }

}
