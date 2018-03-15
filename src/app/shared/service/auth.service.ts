import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { AppUser } from '../model/app-user';
import { UserService } from './user.service';

import * as crypto from 'crypto-js';

@Injectable()
export class AuthService {

    userId: string;

    get appUser$(): Observable<AppUser> {
        return this.afAuth.authState.switchMap(user => (user)
            ? this.userService.get(user.uid)
            : Observable.of(null));
    }

    constructor(
        private afAuth: AngularFireAuth,
        private userService: UserService) {
            this.afAuth.authState.subscribe(result => {
                if (result) {
                    this.userId = result.uid;
                }
            });
    }

    register(userName: string, password: string) {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(this.buildUserFakeEmail(userName), password)
            .then((user) => { this.userService.save(user); return user.uid; })
            .catch((error) => Promise.reject(this.getRegisterError(error.code)));
    }

    login(userName: string, password: string) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(this.buildUserFakeEmail(userName), password)
            .then((user) => user)
            .catch((error) => Promise.reject(this.getLoginError(error.code)));
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    private buildUserFakeEmail(userName: string) {
        const hashName = crypto.SHA256(userName).toString();

        return hashName + '@odrozd-concent-request.com';
    }

    private getRegisterError(code: string) {
        if (code === 'auth/email-already-in-use') {
            return 'The user name is alredy is use.';
        }
        if (code === 'auth/weak-password') {
            return 'Password should be at least 6 characters.';
        }
        if (code === 'auth/invalid-email') {
            return 'The username should have alphanumeric characters.';
        }

        return code;
    }

    private getLoginError(code: string) {
        if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-email') {
            return 'Invalid username and/or password.';
        }

        return code;
    }
}
