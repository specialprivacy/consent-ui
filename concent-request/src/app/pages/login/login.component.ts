import { NgRedux, select } from '@angular-redux/store';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SessionActions } from '../../redux/actions/session.actions';
import { IAppState } from '../../redux/store';
import { AuthService } from '../../shared/service/auth.service';

@Component({
    selector: 'cr-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    @select((s: IAppState) => s.loginErrorMessage)
    readonly errorMessage$: Observable<string>;

    constructor(
        private sessionActions: SessionActions,
        private ngRedux: NgRedux<IAppState>,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService) {
            ngRedux.select<string>('userId').subscribe(userId => {
                if (userId) {
                    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                    this.router.navigate([returnUrl || '/']);
                }
            });
        }

    register(credentials) {
        this.sessionActions.registerUser(credentials.username, credentials.password);
    }

    login(credentials) {
        this.sessionActions.loginUser(credentials.username, credentials.password);
    }
}
