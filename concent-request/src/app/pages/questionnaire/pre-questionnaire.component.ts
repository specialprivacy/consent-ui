import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionnaireService } from '../../shared/service/questionnaire.service';
import { QuestionnaireItem } from '../../shared/model/questionnaire-item';
import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

@Component({
    selector: 'cr-prequestionnaire',
    templateUrl: './pre-questionnaire.component.html',
    styleUrls: ['./pre-questionnaire.component.css']
})
export class PreQuestionnaireComponent implements OnInit, OnDestroy {
    ageFormGroup: FormGroup;
    genderFormGroup: FormGroup;
    educationFormGroup: FormGroup;
    usageFormGroup: FormGroup;
    professionalBackground: FormGroup;
    internetUsage: FormGroup;
    internetUsageAvg: FormGroup;
    internetSatisfactio: FormGroup;
    comfortableComputer: FormGroup;
    device: FormGroup;

    private questionnaireItems: QuestionnaireItem[] = [];
    private formMap: Map<string, FormGroup> = new Map();
    private subscription: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private questionnaireService: QuestionnaireService) {

        this.ageFormGroup = this.createFormGroup('ageFormGroup');
        this.genderFormGroup = this.createFormGroup('genderFormGroup');
        this.educationFormGroup = this.createFormGroup('educationFormGroup');
        this.usageFormGroup = this.createFormGroup('usageFormGroup');
        this.professionalBackground = this.createFormGroup('professionalBackground');
        this.internetUsage = this.createFormGroup('internetUsage');
        this.internetUsageAvg = this.createFormGroup('internetUsageAvg');
        this.internetSatisfactio = this.createFormGroup('internetSatisfactio');
        this.comfortableComputer = this.createFormGroup('comfortableComputer');
        this.device = this.createFormGroup('device');
    }

    ngOnInit() {
        this.loadData();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onComplete() {
        this.saveData();
        this.router.navigate(['thank-you']);
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
        this.subscription = this.questionnaireService.loadPreQuestionnaire().subscribe(items => {
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

        this.questionnaireService.savePreQuestionnaire(itemsToSave);
    }

}
