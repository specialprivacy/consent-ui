import { Item } from './../../../../shared/model/item.model';
import { AcceptedItem } from '../../../../shared/model/accepted-item.model';
import { PathItem } from '../../model/path-item.model';

export class Graph {
    items: Item[];
    acceptedItem: AcceptedItem[];
    targetItem: Item;
    filterItemIds: string[];

    constructor(init?: Partial<Graph>) {
        Object.assign(this, init);
    }
}
