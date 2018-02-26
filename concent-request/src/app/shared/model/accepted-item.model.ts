import { ItemTypeEnum } from '../enum/item-type.enum';
import { AuditableRecord } from './auditable-record';
import { ModeEnum } from '../enum/mode.enum';

export class AcceptedItem extends AuditableRecord {
    path: string[];

    constructor(init?: Partial<AcceptedItem>) {
        super();
        Object.assign(this, init);
    }
}
