import { Component } from '@angular/core';

import { AuthService } from '../../shared/service/auth.service';
import { AppUser } from '../../shared/model/app-user';

@Component({
    selector: 'cr-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    appUser: AppUser;

    constructor(private authService: AuthService) {
        authService.appUser$.subscribe(appUser => this.appUser = appUser);
    }
}
