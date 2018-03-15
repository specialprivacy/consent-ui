import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(route, state: RouterStateSnapshot): Observable<boolean>  {
        return this.authService.appUser$.map(user => {
            if (user && user.isAdmin) {
                return true;
            }

            this.router.navigate(['/no-access']);
            return false;
        });
    }

}
