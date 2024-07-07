import { Injectable } from "@angular/core";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { BehaviorSubject, filter, Observable, of, switchMap, tap } from "rxjs";
import { StorageService } from "./storage.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
    // responseType: 'id_token token', // this is default. Without access_token response, tryLoginImplicitFlow will stop.
    strictDiscoveryDocumentValidation: false,
}

export enum LoginMode {
    Password = 'password',
    AzureAD = 'azuread',
    Google = 'google',
    Facebook = 'facebook',
}


@Injectable()
export class AuthService {
    currentUserSubject: BehaviorSubject<any>;

    appUrl: string = 'https://localhost:44351';
    userName: string | null = null;

    get isLoggedIn() {
        switch (this.loginMode) {
            case LoginMode.AzureAD:
                return this.oauthService.hasValidIdToken();
            case LoginMode.Google:
                return false;
            case LoginMode.Facebook:
                return false;
            default:
                return this.checkValidPwdLoggedInAccessToken();
        }
    }

    get loginMode(): LoginMode {
        var loginMode = this.storageService.LOGIN_MODE;

        if (!Object.values(LoginMode).includes(loginMode)) {
            console.warn(`'${loginMode}' is not belong to LoginMode type! LoginMode.Password is returned.`);
            return LoginMode.Password;
        }

        return loginMode;
    }

    set loginMode(value: LoginMode) {
        this.storageService.LOGIN_MODE = value;
    }

    constructor(
        private http: HttpClient,
        private oauthService: OAuthService,
        private storageService: StorageService,
    ) {
        this.initPasswordLogin();
        this.initAzureAdLogin();
        this.initGoogleLogin();
        this.initFacebookLogin();
        this.currentUserSubject = new BehaviorSubject(this.storageService.LOGGEDIN_USER_PROFILE);
    }

    checkValidPwdLoggedInAccessToken() {
        const authInfo = this.storageService.PASSWORD_LOGGEDIN_AUTHINFO;
        if (!authInfo || !authInfo['access_token']) {
            return false;
        }

        const expires = new Date(authInfo['.expires']);
        const now = new Date();
        return now.getTime() < expires.getTime();
    }

    private initFacebookLogin() {
    }
    private initGoogleLogin() {
    }
    private initPasswordLogin() {
    }
    private initAzureAdLogin() {
        this.oauthService.configure(authConfig);
        this.oauthService.loadDiscoveryDocumentAndTryLogin();

        this.oauthService.events.subscribe(({ type }) => {
            if (type === 'token_received') {
                if (this.isLoggedIn) {
                    const claims: any = this.oauthService.getIdentityClaims();
                    this.userName = claims ? claims.name : null;
                }
            }
        });
    }

    private authenticateUser = (username: string, password: string) => {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const credentials = new URLSearchParams();
        credentials.set('username', username);
        credentials.set('password', password);
        credentials.set('grant_type', 'password');

        return this.http.post(`${this.appUrl}/token`, credentials, { headers });
    }

    private getAppUserProfile = () => {
        const access_token = this.getAPIAccessTokenValue();

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${access_token}`,
        });

        return this.http.get(`${this.appUrl}/api/Account/UserInfo`, { headers });
    }

    private getAPIAccessTokenValue(): string | null {
        if (this.loginMode === LoginMode.Password) {
            return this.storageService.PASSWORD_LOGGEDIN_AUTHINFO?.access_token;
        } else {
            return null;
        }
    }

    loginWithPassword(username: string, password: string) {
        this.loginMode = LoginMode.Password;
        // save loggedin response with access_token & userprofile from api to storage

        if (!username || !password) {
            console.error('Invalid user credentisl!');
            throw 'Invalid user credentisl!';
        }

        return this.authenticateUser(username, password)
            .pipe(switchMap((res) => this.afterAuthenticated(res)));
    }

    afterAuthenticated(authRes: any): Observable<any> {
        return of(authRes)
            .pipe(
                tap((authRes: any) => this.storageService.PASSWORD_LOGGEDIN_AUTHINFO = authRes),
                switchMap(() => this.getAppUserProfile()),
                tap((appUser: any) => this.storageService.LOGGEDIN_USER_PROFILE = appUser),
                tap((appUser: any) => this.currentUserSubject.next(appUser)),
            );
    }

    logout(): void {
        switch (this.loginMode) {
            case LoginMode.AzureAD:
                // this.oauthService.logOut();
                break;
            case LoginMode.Google:
                break;
            case LoginMode.Facebook:
                break;
            default: // LoginMode.Password
                this.storageService.PASSWORD_LOGGEDIN_AUTHINFO = null;
                this.storageService.LOGGEDIN_USER_PROFILE = null;
                break;
        }

        this.currentUserSubject.next(null);
    }

    loginWithAzureAd(): Observable<any> {
        this.loginMode = LoginMode.AzureAD;
        alert('loginWithAzureAd');
        // this.oauthService.initImplicitFlow();

        return of(null)
            .pipe(
                filter(res => !!res),
                switchMap((res) => this.afterAuthenticated(res))
            );
    }

    loginWithGoogle(): Observable<any>  {
        this.loginMode = LoginMode.AzureAD;
        alert('loginWithGoogle');
        return of(null);
    }

    loginWithFacebook(): Observable<any>  {
        this.loginMode = LoginMode.AzureAD;
        alert('loginWithFacebook');
        return of(null);
    }
}
