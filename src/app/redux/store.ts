import { tassign } from 'tassign';

import { PathItem } from '../pages/wizard/model/path-item.model';
import { DataHelper } from '../shared/helpers/data.helper';
import { Item } from '../shared/model/item.model';
import { Group } from './../shared/model/group.model';
import { ConcentRequestActions } from './actions';
import { AcceptedItem } from '../shared/model/accepted-item.model';
import { ModeEnum } from '../shared/enum/mode.enum';
import { SessionActions } from './actions/session.actions';

import * as _ from 'lodash';

export interface IAppState {
    mode: ModeEnum;
    groups: Group[];
    items: Item[];
    acceptedItems: AcceptedItem[];
    selectedGroup: Group;
    selectedItem: Item;
    selectedItemExpanded: Item;
    filteredItems: Item[];
    pathItems: PathItem[];
    userId: string;
    loginErrorMessage: string;
}

export const INITIAL_STATE: IAppState = {
    mode: ModeEnum.Wizard,
    groups: [],
    selectedGroup: null,
    selectedItem: null,
    acceptedItems: [],
    selectedItemExpanded: null,
    items: [],
    filteredItems: [],
    pathItems: [],
    loginErrorMessage: null,
    userId: null
};

export function rootReducer(state: IAppState, action): IAppState {
    let filteredItems;
    let firstItem;
    let selectedItem;
    switch (action.type) {
        case SessionActions.LOGIN_USER_SUCCESS:
            return tassign(state, {
                userId: action.payload.uid
            });
        case SessionActions.LOGIN_USER_ERROR:
            return tassign(state, {
                loginErrorMessage: action.payload.errorMessage
            });
        case ConcentRequestActions.LOAD_DATA_SUCCESS:
            const firstGroup = state.selectedGroup ? state.selectedGroup : action.groups[0];
            filteredItems = DataHelper.filterItemsByType(action.items, firstGroup.type);
            firstItem = filteredItems[0];
            return tassign(state, {
                selectedGroup: firstGroup,
                groups: [...action.groups],
                items: [...action.items],
                acceptedItems: [...action.acceptedItems],
                filteredItems: filteredItems,
                selectedItem: firstItem,
                pathItems: DataHelper.updatePath(action.items, action.groups, state.pathItems, firstGroup.id)
            });
        case ConcentRequestActions.FILTER_ITEMS_BY_GROUP:
            filteredItems = DataHelper.filterItemsByType(state.items, action.group.type);
            selectedItem = (action.selectedItemId) ? DataHelper.findItemById(filteredItems, action.selectedItemId) : (filteredItems && filteredItems.length > 0) ? filteredItems[0] : null;
            return tassign(state, {
                selectedGroup: action.group,
                filteredItems: filteredItems,
                pathItems: DataHelper.updatePath(state.items, state.groups, state.pathItems, action.group.id),
                selectedItem: selectedItem,
                selectedItemExpanded: null
            });
        case ConcentRequestActions.FILTER_ITEMS_BY_GROUP_BY_ITEM:
            const selectedGroup = DataHelper.findGroupById(state.groups, action.groupId);
            const pathItems = DataHelper.updatePath(state.items, state.groups, state.pathItems, action.groupId, action.itemId);
            filteredItems = DataHelper.findRelatives(state.items, selectedGroup, DataHelper.getItemIds(pathItems));
            selectedItem = (action.selectedItemId) ? DataHelper.findItemById(filteredItems, action.selectedItemId) : (filteredItems && filteredItems.length > 0) ? filteredItems[0] : null;
            return tassign(state, {
                selectedGroup: selectedGroup,
                filteredItems: DataHelper.findRelatives(state.items, selectedGroup, DataHelper.getItemIds(pathItems)),
                pathItems: pathItems,
                selectedItem: selectedItem,
                selectedItemExpanded: null
            });
        case ConcentRequestActions.SHOW_ITEM_RELATIONS:
            return tassign(state, {
                selectedItem: DataHelper.findItemById(state.items, action.itemId)
            });
        case ConcentRequestActions.SHOW_ITEM_RELATIONS_EXPANDED:
            return tassign(state, {
                selectedItemExpanded: state.selectedItem
            });
        case ConcentRequestActions.CLOSE_ITEM_RELATIONS_EXPANDED:
            return tassign(state, {
                selectedItemExpanded: null
            });
        case ConcentRequestActions.ITEM_REQUEST_ACCEPTED:
            return tassign(state, {
                selectedItem: DataHelper.findItemById(state.items, action.itemId),
                acceptedItems: [...action.acceptedItems]
            });
        case ConcentRequestActions.ITEM_REQUEST_REVOKED:
            return tassign(state, {
                selectedItem: DataHelper.findItemById(state.items, action.itemId),
                acceptedItems: [...action.acceptedItems]
            });
    }

    return state;
}
