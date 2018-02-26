import { Group } from './../../../shared/model/group.model';
import { Item } from '../../../shared/model/item.model';

export class PathItem {
    name: string;
    icon: string;
    itemId: string;
    groupId: string;

    constructor(init?: Partial<PathItem>) {
        Object.assign(this, init);
    }
}
