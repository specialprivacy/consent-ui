import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import * as _ from 'lodash';

import { IAppState } from '../../redux/store';
import { DataHelper } from '../helpers/data.helper';
import { AcceptedItem } from '../model/accepted-item.model';
import { Item } from '../model/item.model';
import { AuthService } from './auth.service';

@Injectable()
export class ItemService {
    private readonly ACCEPTED_ITEM_API: string = '/accepted-items';
    private userId: string;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private authService: AuthService,
        private db: AngularFireDatabase) {
            authService.appUser$.subscribe(x => {
                this.userId = (x as any).$key;
            });
        }

    public accept(itemId: string) {
        const mode = this.ngRedux.getState().mode;
        const items = this.ngRedux.getState().items;
        const acceptedItems = this.ngRedux.getState().acceptedItems;
        const currentItem = DataHelper.findItemById(items, itemId);
        const result = DataHelper.buildPath(items, currentItem);
        const resultFiltered = DataHelper.filterPath(result, DataHelper.getItemIds(this.ngRedux.getState().pathItems));

        resultFiltered.forEach(path => {
            if (_.find(acceptedItems, x => _.isEqual(x.path, path))) {
                return;
            }

            this.db.list(`${this.ACCEPTED_ITEM_API}/${mode}/${this.userId}`).push(new AcceptedItem({path: path}));
        });
    }

    public revoke(itemId: string) {
        const mode = this.ngRedux.getState().mode;
        const items = this.ngRedux.getState().items;
        const acceptedItems = this.ngRedux.getState().acceptedItems;
        const currentItem = DataHelper.findItemById(items, itemId);

        const result = DataHelper.buildPath(items, currentItem);
        const resultFiltered = DataHelper.filterPath(result, DataHelper.getItemIds(this.ngRedux.getState().pathItems));

        resultFiltered.forEach(path => {
            const acceptedPath = _.find(acceptedItems, x => _.isEqual(x.path, path));
            if (acceptedPath) {
                const key = (acceptedPath as any).$key;
                this.db.list(`${this.ACCEPTED_ITEM_API}/${mode}/${this.userId}/${key}`).remove();
            }
        });
    }

    public loadAcceptedItems(): FirebaseListObservable<AcceptedItem[]> {
        const mode = this.ngRedux.getState().mode;
        return this.db.list(`${this.ACCEPTED_ITEM_API}/${mode}/${this.userId}`);
    }
}
