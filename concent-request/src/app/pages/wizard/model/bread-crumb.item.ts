export class BreadCrumbItem {
    groupId: string;
    itemId: string;
    name: string;
    icon: string;

    constructor(init?: Partial<BreadCrumbItem>) {
        Object.assign(this, init);
    }
}
