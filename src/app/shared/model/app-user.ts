import { AuditableRecord } from './auditable-record';

export class AppUser extends AuditableRecord {
    email: string;
    isQuestionnaireable: boolean;
    isAdmin: boolean = false;

    constructor(init?: Partial<AppUser>) {
        super();
        Object.assign(this, init);
    }
}
