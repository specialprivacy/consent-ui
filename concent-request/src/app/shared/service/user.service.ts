import { AppUser } from '../model/app-user';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class UserService {

    constructor(private db: AngularFireDatabase) { }

    save(user: firebase.User) {
        this.db.object('/users/' + user.uid).update(new AppUser ({
            email: user.email,
            isQuestionnaireable: true
        }));
    }

    getAll() {
        return this.db.list('/users/');
    }

    get(uid: string): FirebaseObjectObservable<AppUser> {
        return this.db.object('/users/' + uid);
    }
}
