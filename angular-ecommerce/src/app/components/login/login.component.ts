import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

//import * as OktaSignIn from '@okta/okta-signin-widget';
const OktaSignIn = require('@okta/okta-signin-widget');

import myAppConfig from 'src/app/config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthService) 
  {

    this.oktaSignin = new OktaSignIn
    ({
      logo: 'assets/images/logo.png',
      features:
      {
        registration: true
      },
      // myAppConfig.oidc.issuer.split('/oauth2')[0] >>> gives everything before '/oauth2'
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams:
      {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

  }

  ngOnInit(): void {

    this.oktaSignin.remove();

    this.oktaSignin.renderEl(
      // el: >>> render element with given ID
      // 'okta-sign-in-widget' >>> defined in HTML, should be same as div tag id in login.component.html
      {el: '#okta-sign-in-widget'},
      (response: any) => 
      {
        if(response.status === 'SUCCESS')
        {
          console.log(response.status);
          this.oktaAuthService.signInWithRedirect();
        }
        else{
          console.log(response.status);
        }
      },
      (error: any) =>
      {
        console.log("Error");
        throw error;
      } 
    );

  }

}
