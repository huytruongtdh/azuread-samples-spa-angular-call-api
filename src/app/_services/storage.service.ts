import { Injectable } from "@angular/core";
import { LoginMode } from "./auth.service";


export enum STORAGEKEYS {
    LOGIN_MODE = 'app.loginmode',
    LOGGEDIN_USER_PROFILE = 'app.loggedin.userprofile',
    PASSWORD_LOGGEDIN_AUTHINFO = 'app.passwordloggedin.authinfo',
}

@Injectable()
export class StorageService {
    get PASSWORD_LOGGEDIN_AUTHINFO(): any {
        const strVal = localStorage.getItem(STORAGEKEYS.PASSWORD_LOGGEDIN_AUTHINFO);
        if (!strVal) {
            return null;
        }

        return JSON.parse(localStorage.getItem(STORAGEKEYS.PASSWORD_LOGGEDIN_AUTHINFO) || '');
    }

    set PASSWORD_LOGGEDIN_AUTHINFO(value: any) {
        if (!value) {
            localStorage.removeItem(STORAGEKEYS.PASSWORD_LOGGEDIN_AUTHINFO);
            return;
        }

        localStorage.setItem(STORAGEKEYS.PASSWORD_LOGGEDIN_AUTHINFO, value && JSON.stringify(value) || null);
    }

    get LOGGEDIN_USER_PROFILE(): any {
        const strVal = localStorage.getItem(STORAGEKEYS.LOGGEDIN_USER_PROFILE);
        if (!strVal) {
            return null;
        }

        return JSON.parse(strVal);
    }

    set LOGGEDIN_USER_PROFILE(value: any) {
        if (!value) {
            localStorage.removeItem(STORAGEKEYS.LOGGEDIN_USER_PROFILE);
            return;
        }

        localStorage.setItem(STORAGEKEYS.LOGGEDIN_USER_PROFILE, value && JSON.stringify(value) || null);
    }

    get LOGIN_MODE(): LoginMode {
        return localStorage.getItem(STORAGEKEYS.LOGIN_MODE) as LoginMode;
    }

    set LOGIN_MODE(value: LoginMode) {
        localStorage.setItem(STORAGEKEYS.LOGIN_MODE, value);
    }

    clearAllPasswordLoggedInData() {
        throw new Error("Method not implemented.");
    }
    getAPIAccessTokenValue(loginMode: LoginMode): string {
        throw new Error("Method not implemented.");
    }
    setLoggedInUserProfile(user: any): void {
        throw new Error("Method not implemented.");
    }
    setPasswordLoginResponse(res: any): void {
        throw new Error("Method not implemented.");
    }
    constructor() {
    }

    setUserProfile(user: any): void {
    }
}