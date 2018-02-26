import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatSort } from '@angular/material';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../redux/store';
import * as _ from 'lodash';
import { DataHelper } from '../../helpers/data.helper';
import { ItemTypeEnum } from '../../enum/item-type.enum';

@Component({
    selector: 'cr-info-dialog',
    styleUrls: ['summary.dialog.component.css'],
    templateUrl: 'summary.dialog.component.html'
})
export class SummaryDialogComponent implements AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[];
    dataSource: MatTableDataSource<Element>;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        public dialogRef: MatDialogRef<SummaryDialogComponent>
    ) {
        this.displayedColumns = ['purpose', 'data', 'storage', 'sharing', 'processing'];
        this.dataSource = new MatTableDataSource<Element>();

        const data = [];
        const acceptedItems = ngRedux.getState().acceptedItems;
        _.forEach(acceptedItems, acceptedItem => {
            const element = new Element();
            _.forEach(acceptedItem.path, itemId => {
                const item = DataHelper.findItemById(ngRedux.getState().items, itemId);
                switch (item.type) {
                    case ItemTypeEnum.Data:
                        element.data = item.name;
                        break;
                    case ItemTypeEnum.Processing:
                        element.processing = item.name;
                        break;
                    case ItemTypeEnum.Purpose:
                        element.purpose = item.name;
                        break;
                    case ItemTypeEnum.Sharing:
                        element.sharing = item.name;
                        break;
                    case ItemTypeEnum.Storage:
                        element.storage = item.name;
                        break;
                }
            });

            data.push(element);
        });

        this.dataSource.data = data;
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
    }

    public onOkClick(): void {
        this.dialogRef.close(true);
    }

    public onCloseClick(): void {
        this.dialogRef.close(false);
    }
}

export class Element {
    purpose: string;
    data: string;
    storage: string;
    sharing: string;
    processing: string;
  }
