import { NgRedux } from '@angular-redux/store';
import { select } from '@angular-redux/store/lib/src/decorators/select';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Item } from '../../../shared/model/item.model';
import { ConcentRequestActions } from './../../../redux/actions';
import { IAppState } from './../../../redux/store';
import { Group } from './../../../shared/model/group.model';
import { GraphComponent } from './../graph/graph.component';
import { Graph } from './../graph/model/graph.model';

@Component({
    selector: 'cr-popup',
    templateUrl: './popup.html',
    styleUrls: ['./popup.css']
})
export class PopupDialogComponent implements OnInit {
    @ViewChild(GraphComponent)
    public graphComponent: GraphComponent;
    @ViewChild('contentContainer')
    public contentContainer: any;
    @select((s: IAppState) => s.selectedItem)
    readonly item$: Observable<Item>;
    @select((s: IAppState) => s.selectedGroup)
    readonly group$: Observable<Group>;

    constructor(
        private ngRedux: NgRedux<IAppState>
    ) {}

    public onNoClick(): void {
        this.ngRedux.dispatch({ type: ConcentRequestActions.CLOSE_ITEM_RELATIONS_EXPANDED });
    }

    public ngOnInit(): void {
        this.graphComponent.width = this.contentContainer.nativeElement.offsetWidth - 50;
        this.graphComponent.height = this.contentContainer.nativeElement.offsetHeight - 20;
        this.graphComponent.miniMode = false;
        this.graphComponent.data = new Graph({
            items: this.ngRedux.getState().items,
            acceptedItem: this.ngRedux.getState().acceptedItems,
            targetItem: this.ngRedux.getState().selectedItem,
            filterItemIds: this.ngRedux.getState().pathItems.filter(x => x.itemId).map(x => x.itemId)
        });
    }

}
