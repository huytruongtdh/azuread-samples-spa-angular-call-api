import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';

// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://login.microsoftonline.com/f7f1996f-3fe9-468c-8aa4-718eb57ba1d8/v2.0',

  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://localhost:4200',

  // The SPA's id. The SPA is registered with this id at the auth-server
  clientId: '3eda60ac-be77-4605-b1cf-82de40e4495c',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: '',
  strictDiscoveryDocumentValidation: false,
}

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!isLoggedIn">
      <button (click)="login()">Login</button>
    </div>
    <div *ngIf="isLoggedIn">
      <h2>Welcome, {{ userName }}</h2>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  userName: string | null = null;

  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  ngOnInit(): void {
    this.oauthService.events.subscribe(({ type }) => {
      if (type === 'token_received') {
        this.isLoggedIn = this.oauthService.hasValidIdToken();
        if (this.isLoggedIn) {
          const claims: any = this.oauthService.getIdentityClaims();
          this.userName = claims ? claims.name : null;
        }
      }
    });
  }

  login(): void {
    this.oauthService.initImplicitFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }
}
