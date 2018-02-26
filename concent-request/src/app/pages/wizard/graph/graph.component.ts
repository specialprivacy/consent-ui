import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import * as d3 from 'd3';
import * as tip from 'd3-tip';
import * as _ from 'lodash';

import { DataHelper } from '../../../shared/helpers/data.helper';
import { Item } from '../../../shared/model/item.model';
import { Graph } from './model/graph.model';

@Component({
    selector: 'cr-graph',
    styleUrls: ['./graph.component.css'],
    templateUrl: './graph.component.html',
})
export class GraphComponent {
    @Input()
    public width: number;
    @Input()
    public height: number;
    @Input()
    public miniMode: boolean = true;

    @Input()
    public set data(value: Graph) {
        this.clear();
        this.buildDataSource(value);
        this.drawChart();
        this.showExpandButton = true;
    }

    @Output()
    expandClick: EventEmitter<void> = new EventEmitter();

    public showExpandButton: boolean = false;
    private targetItem: Item;
    private nativeElement: HTMLElement;
    private treeDataSource: any;

    constructor(private elementRef: ElementRef) {
        this.nativeElement = elementRef.nativeElement;
    }

    clear() {
        this.showExpandButton = false;
        const hist = d3.select(this.nativeElement).select('#chart');
        hist.selectAll('*').remove();
    }

    private buildDataSource(data: Graph) {
        this.targetItem = data.targetItem;
        const result: Item[] = [new Item({id: 'root', name: 'ROOT', parentIds: []})];

        const relatedItems: Item[] = [data.targetItem];
        DataHelper.findChildren(data.items, data.targetItem, relatedItems);
        DataHelper.findParents(data.items, data.targetItem, relatedItems);

        const currentPaths = DataHelper.buildPath(data.items, data.targetItem);
        const filteredPaths = DataHelper.filterPath(currentPaths, data.filterItemIds);
        const matchedPaths = DataHelper.matchPaths(filteredPaths, data.acceptedItem.map(x => x.path));

        const filteredItems = _.filter(relatedItems, x => {
            let contains = false;
            _.forEach(filteredPaths, path => {
                if (path.includes(x.id)) {
                    contains = true;
                    return;
                }
            });

            return contains;
        });

        result.push(...filteredItems);

        const nodesData: any[] = result.map((x) => {
            const currentNode = {
                id: x.id,
                name: x.name,
                icon: DataHelper.getIcon(x.type),
                isAccepted: false,
                isTarget: this.targetItem.id === x.id,
                parent: 'root',
                parents: []
            };

            matchedPaths.forEach(matchedPath => {
                if (_.includes(matchedPath, x.id)) {
                    currentNode.isAccepted = true;
                    return;
                }
            });

            if (x.id === 'root') {
                currentNode.parent = null;
                return currentNode;
            }

            if (!_.isEmpty(x.parentIds)) {
                const parents = [];
                _.forEach(result, resultItem => {
                    if (_.includes(x.parentIds, resultItem.id)) {
                        parents.push(resultItem.id);
                    }
                });

                currentNode.parent = parents[0];
                currentNode.parents = parents.slice(1);
            }

            return currentNode;
        });

        this.treeDataSource = d3.stratify().id(x => x.id).parentId(x => x.parent)(nodesData);
    }

    private drawChart(): void {
        const hist = d3.select(this.nativeElement).select('#chart');
        hist.selectAll('*').remove();

        const margin = { top: 25, right: 25, bottom: 5, left: 25 };
        const width = +this.width - margin.left - margin.right;
        const height = +this.height - margin.top - margin.bottom;
        const g = hist
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const root = d3.hierarchy(this.treeDataSource);

        const rawNodes = root.descendants();
        _.forEach(rawNodes, x => {
            x.depth -= 1;
        });

        const tree = d3.tree().size([height, width]);
        tree(root);

        const flatNodes = root.descendants();
        const extraNodes = [];
        let nodes = flatNodes.slice(1);
        const nodesWithParents = _.filter(nodes, x => {
            const parents = x.data.data.parents;
            return parents && !_.isEmpty(parents);
        });

        _.forEach(nodesWithParents, x => {
            const parents = x.data.data.parents;
            _.forEach(parents, parentId => {
                const childClone = _.clone(x);
                const parent = _.find(nodes, item => item.data.id === parentId);
                childClone.parent = _.clone(parent);
                extraNodes.push(childClone);
            });
        });

        nodes = nodes.concat(extraNodes);
        if (this.miniMode) {
            hist.append('g')
                .attr('transform', 'translate(5, 18)')
                .append('text')
                .text(this.targetItem.name);
        }

        const link = g.selectAll('.link')
                .data(nodes)
                    .enter().append('path')
                        .attr('class', this.miniMode ? 'link' : 'link-light')
                        .attr('d', function(d) {
                            if (d.parent.data.id === 'root') {
                                return null;
                            }
                            return 'M' + d.y + ',' + d.x
                                + 'C' + (d.y + d.parent.y) / 2 + ',' + d.x
                                + ' ' + (d.y + d.parent.y) / 2 + ',' + d.parent.x
                                + ' ' + d.parent.y + ',' + d.parent.x;
                        });

        const node = g.selectAll('.node')
            .data(flatNodes.slice(1))
                .enter().append('g')
                    .attr('class', 'node--internal')
                    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });

        const dots = node.append('text')
            .attr('dy', 5)
            .attr('dx', -5)
            .style('fill', function(d) { return  d.data.data.isAccepted ? '#FF0000' :  null; })
            .style('font-size', (d) => (this.miniMode) ? '0.7em' : '1em')
            .style('cursor', 'default')
            .attr('font-family', 'FontAwesome')
            .text(function(d) {
                return DataHelper.convertIconToUnicode(d.data.data.icon);
            });

        d3.selectAll('.d3-tip').remove();
        const tooltip = new tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return d.data.data.name;
            });


        hist.call(tooltip);
        dots.on('mouseover', tooltip.show)
            .on('mouseout', tooltip.hide);

        if (!this.miniMode) {
            const wrap = function() {
                const self = d3.select(this);
                let textLength = self.node().getComputedTextLength(),
                text = self.text();

                while (textLength > 250 && text.length > 0) {
                    text = text.slice(0, -1);
                    self.text(text + '...');
                    textLength = self.node().getComputedTextLength();
                }
            };

            const maxDepthNode: any = _.maxBy(flatNodes, x => (x as any).depth);
            node.append('text')
                .attr('class', 'truncate')
                .attr('dy', '-12')
                .style('text-anchor', function(d) {
                    return d.depth === 0 ? 'start' : d.depth === maxDepthNode.depth ? 'end' : 'middle';
                })
                .style('fill', 'black')
                .style('font-size', '14px')
                .text(function(d) { return d.data.data.name; })
                .each(wrap);
        }
    }
}
