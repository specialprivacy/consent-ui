import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../redux/store';
import { QuestionnaireItem } from '../model/questionnaire-item';
import { AuthService } from './auth.service';

@Injectable()
export class QuestionnaireService {
    private readonly PRE_QUESTIONNAIRE_API: string = '/pre-questionnaire';
    private readonly POST_QUESTIONNAIRE_API: string = '/post-questionnaire';

    private userId: string;

    constructor(
        private ngRedux: NgRedux<IAppState>,
        private authService: AuthService,
        private db: AngularFireDatabase) {
        this.userId = authService.userId;
    }

    savePreQuestionnaire(items: QuestionnaireItem[]) {
        this.saveQuestionnaire(items, `${this.PRE_QUESTIONNAIRE_API}/${this.userId}`);
    }

    savePostQuestionnaire(items: QuestionnaireItem[]) {
        this.saveQuestionnaire(items, `${this.POST_QUESTIONNAIRE_API}/${this.userId}`);
    }

    loadPreQuestionnaire(): Observable<QuestionnaireItem[]> {
        return this.loadQuestionnaire(`${this.PRE_QUESTIONNAIRE_API}/${this.userId}`);
    }

    loadPreQuestionnaireByUserId(userId): Observable<QuestionnaireItem[]> {
        return this.loadQuestionnaire(`${this.PRE_QUESTIONNAIRE_API}/${userId}`);
    }

    loadPostQuestionnaire(): Observable<QuestionnaireItem[]> {
        return this.loadQuestionnaire(`${this.POST_QUESTIONNAIRE_API}/${this.userId}`);
    }

    loadPostQuestionnaireByUserId(userId): Observable<QuestionnaireItem[]> {
        return this.loadQuestionnaire(`${this.POST_QUESTIONNAIRE_API}/${userId}`);
    }

    private saveQuestionnaire(items: QuestionnaireItem[], api: string) {
        const itemsRef = this.db.list(api);
        items.forEach(x => {
            if (x.id) {
                itemsRef.set(x.id, x);
            } else {
                itemsRef.push(x).then(y => x.id = y.key);
            }
        });
    }

    private loadQuestionnaire(api: string): Observable<QuestionnaireItem[]> {
        return this.db.list(api).snapshotChanges().map((actions) => {
            return actions.map(x => {
                const payload = x.payload.val();
                return new QuestionnaireItem({ id: x.payload.key, questionCode: payload.questionCode, answer: payload.answer });
            });
        });
    }

}
