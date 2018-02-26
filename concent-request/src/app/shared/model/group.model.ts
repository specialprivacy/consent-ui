import { ItemTypeEnum } from '../enum/item-type.enum';
import { AuditableRecord } from './auditable-record';

export class Group extends AuditableRecord {
    id: string;
    type: ItemTypeEnum;
    name: string;
    description: string;
    videoUrl: string;

    constructor(init?: Partial<Group>) {
        super();
        Object.assign(this, init);
    }
}
