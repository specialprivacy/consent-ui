import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'cr-info-dialog',
    template: `
            <h1 mat-dialog-title>Warning!</h1>
            <div mat-dialog-content>
                You have not agreed to share any data with BeFit. <br>So, BeFit cannot provide you with any of the services and, as a result, you cannot use the device.
            </div>
            <div mat-dialog-actions align="center">
                <button mat-raised-button (click)="onOkClick()" tabindex="-1">Ok</button>
            </div>
    `
})
export class InfoDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<InfoDialogComponent>
    ) {}

    public onOkClick(): void {
        this.dialogRef.close();
    }
}
