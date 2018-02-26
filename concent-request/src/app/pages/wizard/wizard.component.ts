import { NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store/lib/src/decorators/select';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { selector } from 'rxjs/operator/publish';

import { ConcentRequestActions } from '../../redux/actions';
import { IAppState } from '../../redux/store';
import { ModeEnum } from '../../shared/enum/mode.enum';
import { DataHelper } from '../../shared/helpers/data.helper';
import { AcceptedItem } from '../../shared/model/accepted-item.model';
import { Group } from '../../shared/model/group.model';
import { Item } from '../../shared/model/item.model';
import { AuthService } from '../../shared/service/auth.service';
import { DataService } from '../../shared/service/data.service';
import { GraphComponent } from './graph/graph.component';
import { Graph } from './graph/model/graph.model';
import { PathItem } from './model/path-item.model';
import { PopupDialogComponent } from './popup/popup';
import { WizardActions } from '../../redux/actions/wizard.actions';
import { InfoDialogComponent } from '../../shared/components/dialogs/info.dialog.component';
import { SummaryDialogComponent } from '../../shared/components/dialogs/summary.dialog.component';

@Component({
    selector: 'cr-wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {
    @ViewChild(GraphComponent)
    public graphComponent: GraphComponent;

    @select((s: IAppState) => s.groups)
    readonly groups$: Observable<Group[]>;
    @select((s: IAppState) => s.selectedGroup)
    readonly selectedGroup$: Observable<Group>;
    @select((s: IAppState) => s.pathItems)
    readonly pathItems$: Observable<PathItem[]>;

    private dialogRef: MatDialogRef<PopupDialogComponent>;

    constructor(
        private dataService: DataService,
        public dialog: MatDialog,
        private ngRedux: NgRedux<IAppState>,
        private router: Router,
        private authService: AuthService
    ) {
        const subscription = this.authService.appUser$.subscribe(user => {
            this.dataService.loadData();
            subscription.unsubscribe();
        });

        ngRedux.getState().mode = ModeEnum.Wizard;

        ngRedux.select<Item>('selectedItem').subscribe(showItemRelations => {
            if (showItemRelations) {
                this.showGraph();
            } else if (this.graphComponent) {
                this.graphComponent.clear();
            }
        });

        ngRedux.select<AcceptedItem[]>('acceptedItems').subscribe(items => { this.showGraph(); });

        ngRedux.select<Item>('selectedItemExpanded').subscribe(showItemRelations => {
            if (showItemRelations) {
                this.dialogRef = this.dialog.open(PopupDialogComponent, { width: '80%', height: '80%' });
            } else if (this.dialogRef) {
                this.dialogRef.close();
            }
        });
    }

    showGraph() {
        const store = this.ngRedux.getState();
        if (!this.graphComponent || _.isEmpty(store.items) || _.isEmpty(store.selectedItem)) {
            return;
        }

        this.graphComponent.data = new Graph({
            items: store.items,
            acceptedItem: store.acceptedItems,
            targetItem: store.selectedItem,
            filterItemIds: store.pathItems.filter(x => x.itemId).map(x => x.itemId)
        });
    }

    ngOnInit() {
    }

    onHelpClick() {
        window.open('/help', '_blank');
    }

    onFinish() {
        const state = this.ngRedux.getState();
        if (_.isEmpty(state.acceptedItems)) {
            this.ngRedux.dispatch({ type: WizardActions.SESSION_NOT_COMPLETED });
            this.dialog.open(InfoDialogComponent);
        } else {
            const dialogRef = this.dialog.open(SummaryDialogComponent, {width: '95%'});
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.ngRedux.dispatch({ type: WizardActions.SESSION_COMPLETED });
                    this.router.navigate(['post-questionnaire']);
                }
            });
        }
    }

    onExpandClick() {
        this.ngRedux.dispatch({ type: ConcentRequestActions.SHOW_ITEM_RELATIONS_EXPANDED });
    }

    onGroupClick(group: Group) {
        this.ngRedux.dispatch({ type: ConcentRequestActions.FILTER_ITEMS_BY_GROUP, group: group  });
    }

    onBreadCrumbItemClick(pathItem: PathItem) {
        const pathItems = this.ngRedux.getState().pathItems;
        const pathItemIndex = this.ngRedux.getState().pathItems.findIndex(x => x.itemId === pathItem.itemId);
        if (pathItemIndex === 0) {
            this.ngRedux.dispatch({
                type: ConcentRequestActions.FILTER_ITEMS_BY_GROUP,
                group: DataHelper.findGroupByItemId(this.ngRedux.getState().groups, this.ngRedux.getState().items, pathItem.itemId),
                selectedItemId: pathItem.itemId
            });
        } else {
            const pathItemToGo = pathItems[pathItemIndex - 1];
            this.ngRedux.dispatch({
                type: ConcentRequestActions.FILTER_ITEMS_BY_GROUP_BY_ITEM,
                groupId: DataHelper.findGroupByItemId(this.ngRedux.getState().groups, this.ngRedux.getState().items, pathItem.itemId).id,
                itemId: pathItemToGo.itemId,
                selectedItemId: pathItem.itemId
            });
        }

    }

}

