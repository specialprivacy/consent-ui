import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { ItemService } from '../../shared/service/item.service';
import { ConcentRequestActions } from '../actions';
import { IAppState } from '../store';

@Injectable()
export class ItemActions {
    constructor(
        private ngRedux: NgRedux<IAppState>,
        private apiService: ItemService) { }

    public accept(itemId: string) {
        this.apiService.accept(itemId);
        const subscription = this.apiService.loadAcceptedItems().subscribe(items => {
            subscription.unsubscribe();
            this.ngRedux.dispatch({ type: ConcentRequestActions.ITEM_REQUEST_ACCEPTED, itemId: itemId, acceptedItems: items });
        });
    }

    public revoke(itemId: string) {
        this.apiService.revoke(itemId);
        const subscription = this.apiService.loadAcceptedItems().subscribe(items => {
            subscription.unsubscribe();
            this.ngRedux.dispatch({ type: ConcentRequestActions.ITEM_REQUEST_REVOKED, itemId: itemId, acceptedItems: items });
        });
    }
}
