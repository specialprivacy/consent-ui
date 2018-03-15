import { AuditableRecord } from './auditable-record';

export class QuestionnaireItem extends AuditableRecord {
    id: string;
    questionCode: string;
    answer: any;

    constructor(init?: Partial<QuestionnaireItem>) {
        super();
        Object.assign(this, init);
    }
}
