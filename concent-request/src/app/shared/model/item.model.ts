import { ItemTypeEnum } from '../enum/item-type.enum';
import { AuditableRecord } from './auditable-record';

export class Item extends AuditableRecord {
    id: string;
    type: ItemTypeEnum;
    name: string;
    parentIds: string[] = [];

    constructor(init?: Partial<Item>) {
        super();
        Object.assign(this, init);
    }
}
