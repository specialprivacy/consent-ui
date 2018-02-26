import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

import { ConcentRequestActions } from '../../redux/actions';
import { ItemTypeEnum } from '../enum/item-type.enum';
import { Group } from '../model/group.model';
import { Item } from '../model/item.model';
import { DataHelper } from '../helpers/data.helper';
import { IAppState } from '../../redux/store';
import { ItemService } from './item.service';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

@Injectable()
export class DataService {
    constructor(
        private ngRedux: NgRedux<IAppState>,
        private itemService: ItemService,
        private db: AngularFireDatabase) {
    }

    loadData() {
        const action = { type: ConcentRequestActions.LOAD_DATA_SUCCESS, groups: [], items: [], acceptedItems: [] };
        const subscription1 = this.db.list('/groups').subscribe(groups => {
            subscription1.unsubscribe();
            groups.forEach(x => x.icon = DataHelper.getIcon(x.type));
            action.groups = groups;
            const subscription2 = this.db.list('/items').subscribe(items => {
                subscription2.unsubscribe();
                items.forEach(x => x.icon = DataHelper.getIcon(x.type));
                action.items = items;
                const subscription3 = this.itemService.loadAcceptedItems().subscribe(acceptedItems => {
                    subscription3.unsubscribe();
                    action.acceptedItems = acceptedItems;
                    this.ngRedux.dispatch(action);
                });
            });
        });

        // _.forEach(this.generateItems(), x => { this.db.list('/items').push(x); });
        // _.forEach(this.generateGroups(), x => { this.db.list('/groups').push(x); });
    }

    private generateItems(): Item[] {
        return [
            new Item ({id: 'purpose_1', type: ItemTypeEnum.Purpose, name: 'Display resting heart rate'}),
            new Item ({id: 'purpose_2', type: ItemTypeEnum.Purpose, name: 'Display all day heart rate'}),
            new Item ({id: 'purpose_3', type: ItemTypeEnum.Purpose, name: 'Display route on map'}),
            new Item ({id: 'purpose_4', type: ItemTypeEnum.Purpose, name: 'Display pointwise velocity on a map'}),
            new Item ({id: 'purpose_5', type: ItemTypeEnum.Purpose, name: 'Derive race time predictions'}),
            new Item ({id: 'purpose_6', type: ItemTypeEnum.Purpose, name: 'Derive calories burned'}),
            new Item ({id: 'purpose_7', type: ItemTypeEnum.Purpose, name: 'Derive cardio fitness score'}),
            new Item ({id: 'purpose_9', type: ItemTypeEnum.Purpose, name: 'Enable a recovery adviser to advise when to start the next workout'}),
            new Item ({id: 'purpose_10', type: ItemTypeEnum.Purpose, name: 'Improve service provider\'s products and services'}),
            new Item ({id: 'purpose_11', type: ItemTypeEnum.Purpose, name: 'Enable targeted fitness advertisement'}),
            new Item ({id: 'purpose_12', type: ItemTypeEnum.Purpose, name: 'Back up data'}),

            new Item ({id: 'data_1', type: ItemTypeEnum.Data, name: 'Resting heart rate', parentIds: ['purpose_1', 'purpose_2']}),
            new Item ({id: 'data_2', type: ItemTypeEnum.Data, name: 'Activity heart rate', parentIds: ['purpose_2', 'purpose_6', 'purpose_7', 'purpose_10']}),
            new Item ({id: 'data_3', type: ItemTypeEnum.Data, name: 'Sleep Time', parentIds: ['purpose_5', 'purpose_10']}),
            new Item ({id: 'data_4', type: ItemTypeEnum.Data, name: 'Steps', parentIds: ['purpose_5', 'purpose_6', 'purpose_9', 'purpose_10']}),
            new Item ({id: 'data_5', type: ItemTypeEnum.Data, name: 'Distance', parentIds: ['purpose_10', 'purpose_9', 'purpose_6', 'purpose_5']}),
            new Item ({id: 'data_6', type: ItemTypeEnum.Data, name: 'GPS coordinates', parentIds: ['purpose_3', 'purpose_4', 'purpose_11', 'purpose_10']}),
            new Item ({id: 'data_7', type: ItemTypeEnum.Data, name: 'Age', parentIds: ['purpose_7', 'purpose_10']}),
            new Item ({id: 'data_8', type: ItemTypeEnum.Data, name: 'Gender', parentIds: ['purpose_10', 'purpose_9', 'purpose_7']}),
            new Item ({id: 'data_9', type: ItemTypeEnum.Data, name: 'Weight', parentIds: ['purpose_9', 'purpose_10', 'purpose_11', 'purpose_7']}),
            new Item ({id: 'data_10', type: ItemTypeEnum.Data, name: 'Activity duration', parentIds: ['purpose_12', 'purpose_11', 'purpose_10', 'purpose_9', 'purpose_6']}),

            new Item ({id: 'storage_1', type: ItemTypeEnum.Storage, name: 'On the device', parentIds: ['data_1', 'data_2', 'data_3', 'data_4']}),
            new Item ({id: 'storage_2', type: ItemTypeEnum.Storage, name: 'On 3rd parties\' infrustructures', parentIds: ['data_4', 'data_5', 'data_7', 'data_8', 'data_9', 'data_6', 'data_10']}),
            new Item ({id: 'storage_3', type: ItemTypeEnum.Storage, name: 'On BeFit\' infrustructures', parentIds: ['data_5', 'data_7']}),

            new Item ({id: 'processing_1', type: ItemTypeEnum.Processing, name: 'On-Device calculations.', parentIds: ['storage_1']}),
            new Item ({id: 'processing_2', type: ItemTypeEnum.Processing, name: 'BeFit\'s calculations.', parentIds: ['storage_3']}),
            new Item ({id: 'processing_3', type: ItemTypeEnum.Processing, name: 'Google calculations.', parentIds: ['sharing_1']}),
            new Item ({id: 'processing_4', type: ItemTypeEnum.Processing, name: 'Axiom calculations.', parentIds: ['sharing_2']}),
            new Item ({id: 'processing_5', type: ItemTypeEnum.Processing, name: 'Dropbox calculations.', parentIds: ['sharing_3']}),
            new Item ({id: 'processing_6', type: ItemTypeEnum.Processing, name: 'Runkeeper calculations.', parentIds: ['sharing_4']}),

            new Item ({id: 'sharing_1', type: ItemTypeEnum.Sharing, name: 'Google', parentIds: ['storage_2']}),
            new Item ({id: 'sharing_2', type: ItemTypeEnum.Sharing, name: 'Axiom', parentIds: ['storage_2']}),
            new Item ({id: 'sharing_3', type: ItemTypeEnum.Sharing, name: 'Dropbox', parentIds: ['storage_2']}),
            new Item ({id: 'sharing_4', type: ItemTypeEnum.Sharing, name: 'Runkeeper', parentIds: ['storage_2']}),
        ];
    }

    private generateGroups(): Group[] {
        return [
            new Group ({
                id: 'purpose',
                type: ItemTypeEnum.Purpose,
                name: 'Purpose',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'We need to process your data to provide the following services:'
            }),
            new Group ({
                id: 'data',
                type: ItemTypeEnum.Data,
                name: 'Data',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we may need to process one or more data categories:'
            }),
            new Group ({
                id: 'storage',
                type: ItemTypeEnum.Storage,
                name: 'Storage',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we will store your data on:'
            }),
            new Group ({
                id: 'sharing',
                type: ItemTypeEnum.Sharing,
                name: 'Sharing',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we may need to share your data with:'
            }),
            new Group ({
                id: 'processing',
                type: ItemTypeEnum.Processing,
                name: 'Processing',
                videoUrl: 'https://www.youtube.com/embed/aVS4W7GZSq0',
                // tslint:disable-next-line:max-line-length
                description: 'Depending on the functionality we will process your data in the following way:'
            }),
        ];
    }

}
