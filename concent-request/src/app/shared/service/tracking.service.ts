import { AppUser } from '../model/app-user';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import * as zipper from 'js-string-compression';
import { AuthService } from './auth.service';
import { ConcentRequestActions } from '../../redux/actions';

@Injectable()
export class TrackingService {
    private zip: any;

    constructor(
        private db: AngularFireDatabase,
        private authService: AuthService) {
        this.zip = new zipper.Hauffman();
    }

    track(action: any) {
        const userId = this.authService.userId;
        const itemsRef = this.db.list('/logs/' + userId);

        if (action.type === ConcentRequestActions.LOAD_DATA_SUCCESS) {
            itemsRef.push('RESTART');
        }

        itemsRef.push(action);
    }

    loadLog(userId) {
        return this.db.list('/logs/' + userId).snapshotChanges().map((actions) => {
            return actions.map(x => {
                const payload = x.payload.val();

                return payload;
            });
        });
    }

}
