import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router/src/interfaces';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(route, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.appUser$.map(user => {
            if (user) {
                return true;
            }

            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        });
    }

}
