import { NgRedux } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';

import { Group } from '../../../shared/model/group.model';
import { Item } from '../../../shared/model/item.model';
import { ConcentRequestActions } from './../../../redux/actions';
import { IAppState } from './../../../redux/store';
import { ItemTypeEnum } from './../../../shared/enum/item-type.enum';
import { ItemActions } from '../../../redux/actions/item.actions';
import { AcceptedItem } from '../../../shared/model/accepted-item.model';
import { DataHelper } from '../../../shared/helpers/data.helper';

@Component({
    selector: 'cr-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
    readonly dataSource: MatTableDataSource<any> = new MatTableDataSource();
    groups: Group[] = [];
    usedTypes: ItemTypeEnum[] = [];
    selectedRowId: string;

    private currentItems: Item[];
    private groupsInPaths: Map<string, ItemTypeEnum[]> = new Map();

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private itemActions: ItemActions
    ) {
        ngRedux.select<Item>('selectedItem').subscribe(item => { this.highlight(item); });
        ngRedux.select<Item[]>('filteredItems').subscribe(items => { this.updateDataSource(items); });
        ngRedux.select<AcceptedItem[]>('acceptedItems').subscribe(items => { this.updateAcceptedItemDataSource(items); });
    }

    disableClass(group: Group, item: Item): string {
        const isUsed = _.includes(this.usedTypes, group.type);
        const isAbsent = !this.groupsInPaths.has(item.id) || !_.includes(this.groupsInPaths.get(item.id), group.type);

        return isUsed || isAbsent ? 'disabled' : '';
    }

    private highlight(row) {
        this.selectedRowId = (row) ? row.id : null;
    }

    onRowClick(item: Item) {
        this.ngRedux.dispatch({
            type: ConcentRequestActions.SHOW_ITEM_RELATIONS,
            itemId: item.id
        });
    }

    onGroupClick(group: Group, record: Item) {
        this.ngRedux.dispatch({
            type: ConcentRequestActions.FILTER_ITEMS_BY_GROUP_BY_ITEM,
            groupId: group.id,
            itemId: record.id
        });
    }

    onChange(checked, item: Item) {
        (checked)
        ? this.itemActions.accept(item.id)
        : this.itemActions.revoke(item.id);
    }

    ngOnInit() {
    }

    private updateAcceptedItemDataSource(items: AcceptedItem[]) {
        const dataSource = this.dataSource.data;
        if (!dataSource) {
            return;
        }

        dataSource.forEach(item => this.updateCheckedState(item, item));
    }

    private updateDataSource(items: Item[]) {
        if (_.isEqual(this.currentItems, items)) {
            return;
        }
        this.currentItems = items;

        const store = this.ngRedux.getState();
        const itemsDataSource = store.filteredItems.map(x => Object.assign(this.updateCheckedState({}, x), x));
        this.dataSource.data = itemsDataSource;
        this.groups = _.filter(store.groups, x => x.type !== store.selectedGroup.type);

        this.usedTypes = [];
        const types: ItemTypeEnum[] = [];
        _.each(store.pathItems, x => {
            if (x.itemId) {
                const item = _.find(store.items, y => y.id === x.itemId);
                this.usedTypes.push(item.type);
            }
        });
    }

    private updateCheckedState(targetState: any, item: Item) {
        const store = this.ngRedux.getState();
        const acceptedPaths = store.acceptedItems.map(x => x.path);
        const currentPaths = DataHelper.buildPath(store.items, item);
        const filteredPaths = DataHelper.filterPath(currentPaths, DataHelper.getItemIds(store.pathItems));
        const matchedPathCounter = DataHelper.matchPaths(filteredPaths, acceptedPaths).length;

        const groups = [];
        _.forEach(filteredPaths, path => {
            _.forEach(path, itemId => {
                groups.push(DataHelper.findItemById(store.items, itemId).type);
            });
        });

        this.groupsInPaths.set(item.id, groups);

        targetState.isAccepted = filteredPaths.length === matchedPathCounter;
        targetState.isIndeterminate = matchedPathCounter > 0 && matchedPathCounter < filteredPaths.length;

        return targetState;
    }
}
