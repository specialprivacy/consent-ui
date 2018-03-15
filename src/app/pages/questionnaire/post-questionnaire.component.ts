
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { SessionActions } from '../../redux/actions/session.actions';
import { Subscription } from 'rxjs/Subscription';
import { QuestionnaireService } from '../../shared/service/questionnaire.service';
import { QuestionnaireItem } from '../../shared/model/questionnaire-item';

import * as _ from 'lodash';

@Component({
    selector: 'cr-postquestionnaire',
    templateUrl: './post-questionnaire.component.html',
    styleUrls: ['./post-questionnaire.component.css']
})
export class PostQuestionnaireComponent implements OnInit, OnDestroy {
    agreeingToProcessed: FormGroup;
    satisfiedConsentRequest: FormGroup;
    rateConsentRequest: FormGroup;
    recommendConsentRequest: FormGroup;
    impressionTimeToComplete: FormGroup;
    concentMeetsNeeds: FormGroup;
    keepUsingConsent: FormGroup;
    usefulTreeGraph: FormGroup;
    understandableTreeGraph: FormGroup;
    usefulVideo: FormGroup;
    whyGiveConsent: FormGroup;
    mostAppealing: FormGroup;
    hardestPart: FormGroup;
    surprisingUnexpected: FormGroup;
    toImproveConsent: FormGroup;
    whatMissing: FormGroup;
    whatLike: FormGroup;
    howEasyUse: FormGroup;
    featureImportantMost: FormGroup;
    featureImportantLeast: FormGroup;
    keepUsing: FormGroup;
    wordsDescribe: FormGroup;
    forWhatPurpose: FormGroup;
    howDataStored: FormGroup;
    what3rdPartyToShare: FormGroup;
    easiestPart: FormGroup;
    improveTreeGraph: FormGroup;
    usefulTab: FormGroup;
    notUsefulTab: FormGroup;

    private formMap: Map<string, FormGroup> = new Map();
    private subscription: Subscription;
    private questionnaireItems: QuestionnaireItem[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private session: SessionActions,
        private questionnaireService: QuestionnaireService) {
            this.agreeingToProcessed = this._formBuilder.group({
                purpose: ['', Validators.required],
                data: ['', Validators.required],
                storage: ['', Validators.required],
                processing: ['', Validators.required],
                sharing: ['', Validators.required]
            });
            this.formMap.set('agreeingToProcessed', this.agreeingToProcessed);

            this.improveTreeGraph = this.createFormGroup('improveTreeGraph');
            this.satisfiedConsentRequest = this.createFormGroup('satisfiedConsentRequest');
            this.easiestPart = this.createFormGroup('easiestPart');
            this.rateConsentRequest = this.createFormGroup('rateConsentRequest');
            this.recommendConsentRequest = this.createFormGroup('recommendConsentRequest');
            this.impressionTimeToComplete = this.createFormGroup('impressionTimeToComplete');
            this.concentMeetsNeeds = this.createFormGroup('concentMeetsNeeds');
            this.keepUsingConsent = this.createFormGroup('keepUsingConsent');
            this.usefulTreeGraph = this.createFormGroup('usefulTreeGraph');
            this.understandableTreeGraph = this.createFormGroup('understandableTreeGraph');
            this.usefulVideo = this.createFormGroup('usefulVideo');
            this.whyGiveConsent = this.createFormGroup('whyGiveConsent');
            this.mostAppealing = this.createFormGroup('mostAppealing');
            this.hardestPart = this.createFormGroup('hardestPart');
            this.surprisingUnexpected = this.createFormGroup('surprisingUnexpected');
            this.toImproveConsent = this.createFormGroup('toImproveConsent');
            this.whatMissing = this.createFormGroup('whatMissing');
            this.whatLike = this.createFormGroup('whatLike');
            this.howEasyUse = this.createFormGroup('howEasyUse');
            this.featureImportantMost = this.createFormGroup('featureImportantMost');
            this.featureImportantLeast = this.createFormGroup('featureImportantLeast');
            this.keepUsing = this.createFormGroup('keepUsing');
            this.forWhatPurpose = this.createFormGroup('forWhatPurpose');
            this.howDataStored = this.createFormGroup('howDataStored');
            this.what3rdPartyToShare = this.createFormGroup('what3rdPartyToShare');

            this.usefulTab = this._formBuilder.group({
                purpose: [''],
                data: [''],
                storage: [''],
                sharing: [''],
                processing: [''],
                none: [''],
            });
            this.formMap.set('usefulTab', this.usefulTab);

            this.notUsefulTab = this._formBuilder.group({
                purpose: [''],
                data: [''],
                storage: [''],
                sharing: [''],
                processing: [''],
                none: [''],
            });
            this.formMap.set('notUsefulTab', this.notUsefulTab);

            this.wordsDescribe = this._formBuilder.group({
                annoying: [''],
                appealing: [''],
                boring: [''],
                clear: [''],
                compelling: [''],
                complex: [''],
                confusing: [''],
                cuttingEdge: [''],
                dated: [''],
                difficult: [''],
                disruptive: [''],
                distracting: [''],
                dull: [''],
                easyToUse: [''],
                effective: [''],
                efficient: [''],
                effortless: [''],
                empowering: [''],
                engaging: [''],
                exceptional: [''],
                familiar: [''],
                fast: [''],
                flexible: [''],
                fresh: [''],
                friendly: [''],
                frustrating: [''],
                getsInTheWay: [''],
                hardToUse: [''],
                Helpful: [''],
                highQuality: [''],
                impressive: [''],
                ineffective: [''],
                innovative: [''],
                inspiring: [''],
                intimidating: [''],
                intuitive: [''],
                inviting: [''],
                irrelevant: [''],
                old: [''],
                ordinary: [''],
                organized: [''],
                overwhelming: [''],
                patronizing: [''],
                poorQuality: [''],
                powerful: [''],
                responsive: [''],
                rigid: [''],
                satisfying: [''],
                slow: [''],
                timeConsuming: [''],
                timeSaving: [''],
                tooTechnical: [''],
                unapproachable: [''],
                unattractive: [''],
                uncontrollable: [''],
                understandable: [''],
                undesirable: [''],
                unpredictable: [''],
                usable: [''],
                useful: [''],
                valuable: ['']
            });

            this.formMap.set('wordsDescribe', this.wordsDescribe);
        }


    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onComplete() {
        this.saveData();
        this.router.navigate(['demographic-data']);
    }

    onNext() {
        this.saveData();
    }

    private createFormGroup(name: string) {
        const formGroup = this._formBuilder.group({ value: ['', Validators.required] });
        this.formMap.set(name, formGroup);

        return formGroup;
    }

    private loadData() {
        this.subscription = this.questionnaireService.loadPostQuestionnaire().subscribe(items => {
            this.questionnaireItems = items;
            items.forEach(x => {
                if (this.formMap.has(x.questionCode)) {
                    this.formMap.get(x.questionCode).setValue(x.answer);
                }
            });

            this.subscription.unsubscribe();
        });
    }

    private saveData() {
        const itemsToSave: QuestionnaireItem[] = [];
        this.formMap.forEach((value, key) => {
            let toSave = _.find(this.questionnaireItems, (x) => x.questionCode === key);
            if (!toSave) {
                toSave = new QuestionnaireItem({questionCode: key});
                this.questionnaireItems.push(toSave);
            }

            toSave.answer = value.value;

            itemsToSave.push(toSave);
        });

        this.questionnaireService.savePostQuestionnaire(itemsToSave);
    }
}
