import * as _ from 'lodash';

import { PathItem } from '../../pages/wizard/model/path-item.model';
import { ItemTypeEnum } from '../enum/item-type.enum';
import { Group } from '../model/group.model';
import { Item } from '../model/item.model';

export class DataHelper {

    static getIcon(itemType: ItemTypeEnum): string {
        switch (itemType) {
            case ItemTypeEnum.Data:
                return 'fa fa-id-card-o';
            case ItemTypeEnum.Purpose:
                return 'fa fa-bullseye';
            case ItemTypeEnum.Processing:
                return 'fa fa-retweet';
            case ItemTypeEnum.Storage:
                return 'fa fa-archive';
            case ItemTypeEnum.Sharing:
                return 'fa fa-share-alt';
        }

        return null;
    }

    static convertIconToUnicode(icon: string): string {
        switch (icon) {
            case 'fa fa-id-card-o':
                return '\uf2c3';
            case 'fa fa-bullseye':
                return '\uf140';
            case 'fa fa-retweet':
                return '\uf079';
            case 'fa fa-archive':
                return '\uf187';
            case 'fa fa-share-alt':
                return '\uf1e0';
        }

        return null;
    }

    static findGroupById(groups: Group[], id: string): Group {
        return _.find(groups, x => x.id === id);
    }

    static findGroupByType(groups: Group[], itemType: ItemTypeEnum): Group {
        return _.find(groups, x => x.type === itemType);
    }

    static findGroupByItemId(roups: Group[], items: Item[], itemId: string): Group {
        const item = this.findItemById(items, itemId);

        return this.findGroupByType(roups, item.type);
    }

    static filterItemsByType(items: Item[], itemType: ItemTypeEnum): Item[] {
        return _.filter(items, x => x.type === itemType);
    }

    static findItemById(items: Item[], itemId: string): Item {
        return _.find(items, x => x.id === itemId);
    }

    static findItemsByParentId(items: Item[], item: Item): Item[] {
        const result: Item[] = [];
        _.each(items, x => {
            if (_.includes(x.parentIds, item.id)) {
                result.push(x);
            }
        });

        return result;
    }

    static updatePath(items: Item[], groups: Group[], pathItems: PathItem[], groupId: string, itemId?: string): PathItem[] {
        const targetGroup = this.findGroupById(groups, groupId);
        const pathItemLast = new PathItem({ name: targetGroup.name, icon: this.getIcon(targetGroup.type) });
        if (!itemId) {
            return [pathItemLast];
        }

        const item = this.findItemById(items, itemId);
        const pathItem = new PathItem({
            name: item.name,
            icon: this.getIcon(item.type),
            itemId: itemId
        });

        const index = _.findIndex(pathItems, x => x.itemId === itemId);
        const result = _.slice(pathItems, 0, index);

        result.push(pathItem);
        result.push(pathItemLast);

        return result;
    }

    static findParents(items: Item[], item: Item, result: Item[]): void {
        if (_.isEmpty(item.parentIds)) {
            return;
        }

        item.parentIds.forEach(x => {
            const parent = this.findItemById(items, x);
            if (!_.includes(result, parent)) {
                result.push(parent);
            }

            this.findParents(items, parent, result);
        });
    }

    static findChildren(items: Item[], item: Item, result: Item[]): void {
        const children = this.findItemsByParentId(items, item);
        _.each(children, x => {
            if (!_.includes(result, x)) {
                result.push(x);
            }

            this.findChildren(items, x, result);
        });
    }

    static buildPath(items: Item[], item: Item): string[][] {
        const children = {list: [], path: []};
        DataHelper.findPathForChildren(items, item, children);
        const parents = {list: [], path: []};
        DataHelper.findPathForParents(items, item, parents);

        const result = [];
        children.list.forEach(x => {
            parents.list.forEach(y => {
                result.push(_.uniq(y.concat(x)));
            });
        });

        return result;
    }

    static filterPath(paths: string[][], itemIds: string[]): string[][] {
        const result = [];

        _.forEach(paths, path => {
            let includeCounter = 0;
            _.forEach(itemIds, itemId => {
                if (path.includes(itemId)) {
                    includeCounter++;
                }
            });

            if (itemIds.length === includeCounter) {
                result.push(path);
            }
        });

        return result;
    }

    static matchPaths(currentPaths: string[][], acceptedPaths: string[][]): string[][] {
        const result = [];
        currentPaths.forEach(currentPath => {
            acceptedPaths.forEach(acceptedPath => {
                if (_.isEqual(currentPath, acceptedPath)) {
                    result.push([...acceptedPath]);
                    return;
                }
            });
        });

        return result;
    }

    static findPathForParents(items: Item[], item: Item, result: any): void {
        if (!result.path) {
            result.path = [];
            result.list = [];
        }

        const last: Item = _.last(result.path);
        const children = this.findItemsByParentId(items, item);
        if (!last || _.includes(children, last)) {
            result.path.push(item);
        } else {
            const reversePath = _.reverse(result.path);
            let lastChild = null;
            reversePath.forEach(x => {
                if (_.includes(children, x)) {
                    lastChild = x;
                    return;
                }
            });

            _.reverse(result.path);
            result.path = _.slice(result.path, 0, _.indexOf(result.path, lastChild) + 1);
            result.path.push(item);
        }

        let parents = [];
        if (item.parentIds) {
            parents = item.parentIds.map(x => DataHelper.findItemById(items, x));
        }
        _.each(parents, x => {
            this.findPathForParents(items, x, result);
        });

        const path = _.reverse(result.path.map(x => x.id));
        let pathCommited = false;
        result.list.forEach(x => {
            if (_.isEqual(x, path)) {
                pathCommited = true;
                return;
            }
        });

        if (!pathCommited) {
            result.list.push(path);
        }
    }

    static findPathForChildren(items: Item[], item: Item, result: any): void {
        if (!result.path) {
            result.path = [];
            result.list = [];
        }

        const last: Item = _.last(result.path);
        if (!last || _.includes(item.parentIds, last.id)) {
            result.path.push(item);
        } else {
            const reversePath = _.reverse(result.path);
            let lastParent = null;
            reversePath.forEach(x => {
                if (_.includes(item.parentIds, x.id)) {
                    lastParent = x;
                    return;
                }
            });

            _.reverse(result.path);
            result.path = _.slice(result.path, 0, _.indexOf(result.path, lastParent) + 1);
            result.path.push(item);
        }

        const children = this.findItemsByParentId(items, item);
        _.each(children, x => {
            this.findPathForChildren(items, x, result);
        });

        const path = result.path.map(x => x.id);
        let pathCommited = false;
        result.list.forEach(x => {
            if (_.isEqual(x, path)) {
                pathCommited = true;
                return;
            }
        });

        if (!pathCommited) {
            result.list.push(path);
        }
    }

    static getItemIds(pathItems: PathItem[]) {
        return pathItems.filter(x => x.itemId).map(x => x.itemId);
    }

    static findRelatives(items: Item[], targetGroup: Group, filterItemIds: string[]): Item[] {
        const result: Set<Item> = new Set();
        const targetGroupItems = _.filter(items, x => x.type === targetGroup.type);
        _.forEach(targetGroupItems, item => {
            const paths = this.buildPath(items, item);
            const filteredPaths = this.filterPath(paths, filterItemIds);
            _.forEach(filteredPaths, path => {
                const pathItems = path.map(x => this.findItemById(items, x)).filter(x => x.type === targetGroup.type);
                _.forEach(pathItems, resultItem => {
                    result.add(resultItem);
                });
            });
        });

        const resultItems = [];
        result.forEach(x => {
            resultItems.push(x);
        });

        return resultItems;
    }
}
