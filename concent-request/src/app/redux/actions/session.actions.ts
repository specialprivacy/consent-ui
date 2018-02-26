import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { AuthService } from '../../shared/service/auth.service';
import { IAppState } from '../store';

@Injectable()
export class SessionActions {
    static LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
    static LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private authService: AuthService) {}

    loginUser(userName: string, password: string) {
        this.authService
            .login(userName, password)
            .then(result => this.dispatchSuccess(result))
            .catch(error => this.dispatchError(error));
    }

    registerUser(userName: string, password: string) {
        this.authService
            .register(userName, password)
            .then(result => this.dispatchSuccess(result))
            .catch(error => this.dispatchError(error));
    }

    logoutUser() {
        this.authService.logout();
    }

    private dispatchSuccess(result) {
        this.ngRedux.dispatch({ type: SessionActions.LOGIN_USER_SUCCESS, payload: { uid: (result.uid) ? result.uid : result } });
    }

    private dispatchError(result) {
        this.ngRedux.dispatch({ type: SessionActions.LOGIN_USER_ERROR, payload: { errorMessage: result } });
    }
}
