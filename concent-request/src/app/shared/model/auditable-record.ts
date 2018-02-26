export class AuditableRecord {
    dateString: string = new Date().toISOString();
    date: number = new Date().getTime();
}
