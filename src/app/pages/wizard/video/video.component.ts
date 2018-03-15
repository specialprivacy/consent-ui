import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Group } from './../../../shared/model/group.model';
import { NgRedux } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';

import { IAppState } from './../../../redux/store';


@Component({
    selector: 'cr-video',
    templateUrl: './video.component.html'
})
export class VideoComponent implements OnInit {
    youtubeSrc: SafeResourceUrl;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private sanitizer: DomSanitizer) {
        ngRedux.select<Group>('selectedGroup').subscribe(selectedGroup => {
            if (selectedGroup) {
                this.youtubeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(selectedGroup.videoUrl);
            }
        });
    }

    ngOnInit() {
    }
}
