
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AuthService } from '../../shared/service/auth.service';
import { AppUser } from '../../shared/model/app-user';
import { TrackingService } from '../../shared/service/tracking.service';
import { UserService } from '../../shared/service/user.service';
import { Subscription } from 'rxjs/Subscription';
import * as FileSaver from 'file-saver';
import { QuestionnaireService } from '../../shared/service/questionnaire.service';
import { QuestionnaireItem } from '../../shared/model/questionnaire-item';

@Component({
    selector: 'cr-admin',
    templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {
    users: AppUser[] = [];

    private userSubscription: Subscription;
    private logSubscription: Subscription;

    constructor(
        private userService: UserService,
        private trackingService: TrackingService,
        private questionnaireService: QuestionnaireService
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.userService.getAll().subscribe(x => {
            this.users = x;
            this.users = _.sortBy(this.users, y => y.date);
        });
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
        this.logSubscription.unsubscribe();
    }

    onUserClick(userd) {
        // const logSubscription = this.trackingService.loadLog(userd.$key).subscribe(x => {
        //     const logs = [];
        //     let currentLog = [];
        //     _.forEach(x, log => {
        //         if (log === 'RESTART') {
        //             logs.push([...currentLog]);
        //             currentLog = [];
        //         } else {
        //             currentLog.push(log);
        //         }
        //     });

        //     logs.push(currentLog);
        //     logs.shift();

        //     let counter = 0;
        //     _.forEach(logs, item => {
        //         this.saveSteps(item, ++counter, userd);
        //     });

        //     logSubscription.unsubscribe();
        // });

        let qstn = '';
        const qsn1 = this.questionnaireService.loadPreQuestionnaireByUserId(userd.$key).subscribe(x => {
            const questions: Map<string, string> = new Map();
            questions.set('genderFormGroup', 'What is your gender?');
            questions.set('ageFormGroup', 'What is your age?');
            questions.set('educationFormGroup', 'What is the highest level of education you have completed?');
            questions.set('professionalBackground', 'What is (or was) your field of studies?');
            questions.set('internetUsageAvg', 'On average, how many hours per day do you spend on the Internet?');
            questions.set('internetSatisfactio', 'How would you assess your current skills for using the Internet?');
            questions.set('comfortableComputer', 'How easy is it for you to use computers?');
            questions.set('device', 'What is your preferred device to browse the Internet?');

            const answers: Map<string, string[]> = new Map();
            answers.set('genderFormGroup', ['Male', 'Female']);
            answers.set('ageFormGroup', ['less than 16 years old', '16-25 years old', '26-35 years old', '36-45 years old', '46-55 years old', '55 years and over']);
            // tslint:disable-next-line:max-line-length
            answers.set('educationFormGroup', ['Some high school, no diploma', 'High school graduate, diploma or the equivalent', 'Trade/technical/vocational training', 'Some college, no degree', 'Bachelor’s degree', 'Mater’s degree', 'Doctorate degree']);
            answers.set('professionalBackground', ['Natural and Physical Sciences', 'Information Technology', 'Engineering and Related Technologies', 'Architecture and Building', 'Agriculture, Environment and Related Studies',
                'Agriculture, Environment and Related Studies', 'Health', 'Education', 'Management and Commerce', 'Society and Culture', 'Creative Arts', 'Food, Hospitality and Personal Services']);
            answers.set('internetUsageAvg', ['Less than 1 hour a day', '1-3 hours', '3-6 hours', '6-8 hours', 'More than 8 hours a day']);
            answers.set('internetSatisfactio', ['Novice', 'Advanced beginner', 'Competent', 'Proficient', 'Expert']);
            answers.set('comfortableComputer', ['Very difficult', 'Somewhat difficult', 'Neither difficult nor easy', 'Somewhat easy', 'Very easy']);
            answers.set('device', ['Desktop computer', 'Laptop', 'Tablet', 'Smartphone']);

            qstn += this.saveQuestionnaire(x, userd, questions, answers, 'Questionnaire1');

            qsn1.unsubscribe();


            const qsn2 = this.questionnaireService.loadPostQuestionnaireByUserId(userd.$key).subscribe(y => {
                qstn += '\u000d\u000d';
                const questions2: Map<string, string> = new Map();
                questions2.set('agreeingToProcessed', 'What do you remember agreeing to?');
                questions2.set('usefulTab', 'Information on which tab or tabs did you find useful and informative?');
                questions2.set('notUsefulTab', 'Which tab or tabs should be removed because they are useless and overcomplicate everything?');
                questions2.set('satisfiedConsentRequest', 'Overall, how satisfied or dissatisfied are you with the consent request?');
                questions2.set('recommendConsentRequest', 'How likely is it that you would recommend the consent request to a friend?');
                questions2.set('impressionTimeToComplete', 'What was you impression of the time it took you to complete the tasks?');
                questions2.set('wordsDescribe', 'Which of the following words would you use to describe the consent request?');
                questions2.set('concentMeetsNeeds', 'How well the consent request does meet your needs for privacy policy representation?');
                questions2.set('understandableTreeGraph', 'How understandable did you find the tree graph?');
                questions2.set('usefulTreeGraph', 'How useful did you find the tree graph?');
                questions2.set('improveTreeGraph', 'What would you suggest to improve in the tree graph?');
                questions2.set('mostAppealing', 'What did you like most about the consent request in comparison to a traditional privacy policy?');
                questions2.set('easiestPart', 'What’s the easiest part about using the consent request?');
                questions2.set('hardestPart', 'What’s the hardest part about using the consent request?');
                questions2.set('surprisingUnexpected', 'Was there anything surprising or unexpected about the consent request?');
                questions2.set('toImproveConsent', 'What could be done to improve the consent request?');
                questions2.set('howEasyUse', 'How easy is the consent request to use?');
                questions2.set('featureImportantMost', 'Which feature (or features) of the consent request are most important to you?');
                questions2.set('featureImportantLeast', 'Which feature (or features) of the consent request are least important to you?');
                questions2.set('keepUsing', 'What might keep people from using the consent request?');

                const answers2: Map<string, any> = new Map();
                answers2.set('agreeingToProcessed', {
                    data: 'Data',
                    sharing: 'Sharing',
                    storage: 'Storage',
                    purpose: 'Purpose',
                    processing: 'Processing'
                });

                answers2.set('usefulTab', {
                    data: 'Data',
                    sharing: 'Sharing',
                    storage: 'Storage',
                    purpose: 'Purpose',
                    processing: 'Processing',
                    none: 'None'
                });

                answers2.set('notUsefulTab', {
                    data: 'Data',
                    sharing: 'Sharing',
                    storage: 'Storage',
                    purpose: 'Purpose',
                    processing: 'Processing',
                    none: 'None'
                });

                answers2.set('wordsDescribe',
                        {
                            // tslint:disable-next-line:max-line-length
                            annoying: 'Annoying', appealing: 'Appealing', boring: 'Boring', clear: 'Clear', compelling: 'Compelling', complex: 'Complex', confusing: 'Confusing', cuttingEdge: 'Cutting edge', dated: 'Dated', difficult: 'Difficult',
                            // tslint:disable-next-line:max-line-length
                            disruptive: 'Disruptive', distracting: 'Distracting', dull: 'Dull', easyToUse: 'Easy to use', effective: 'Effective', efficient: 'Efficient', effortless: 'Effortless', empowering: 'Empowering', engaging: 'Engaging', exceptional: 'Exceptional',
                            // tslint:disable-next-line:max-line-length
                            familiar: 'Familiar', fast: 'Fast', flexible: 'Flexible', fresh: 'Fresh', friendly: 'Friendly', frustrating: 'Frustrating', getsInTheWay: 'Gets in the way', hardToUse: 'Hard to Use', Helpful: 'Helpful', highQuality: 'High quality',
                            // tslint:disable-next-line:max-line-length
                            impressive: 'Impressive', ineffective: 'Ineffective', innovative: 'Innovative', inspiring: 'Inspiring', intimidating: 'Intimidating', intuitive: 'Intuitive', inviting: 'Inviting', irrelevant: 'Irrelevant', old: 'Old', ordinary: 'Ordinary',
                            // tslint:disable-next-line:max-line-length
                            organized: 'Organized', overwhelming: 'Overwhelming', patronizing: 'Patronizing', poorQuality: 'Poor quality', powerful: 'Powerful', responsive: 'Responsive', rigid: 'Rigid', satisfying: 'Satisfying', slow: 'slow', timeConsuming: 'timeConsuming',
                            // tslint:disable-next-line:max-line-length
                            timeSaving: 'Time-Saving', tooTechnical: 'Too Technical', unapproachable: 'Unapproachable', unattractive: 'Unattractive', uncontrollable: 'Uncontrollable', understandable: 'Understandable', undesirable: 'Undesirable', unpredictable: 'Unpredictable', usable: 'Usable', useful: 'Useful', valuable: 'Valuable'
                        }
                );

                answers2.set('satisfiedConsentRequest', ['Very satisfied', 'Somewhat satisfied', 'Neither satisfied nor dissatisfied', 'Somewhat dissatisfied', 'Very dissatisfied']);
                answers2.set('recommendConsentRequest', ['Not at all likely', 'Slightly likely', 'Moderately likely', 'Very likely', 'Extremely likely']);
                answers2.set('impressionTimeToComplete', ['Too long', 'Too long but it was worth while', 'About the right amount of time', 'It took less time than I thought it would']);
                answers2.set('concentMeetsNeeds', ['Extremely well', 'Very well', 'Somewhat well', 'Not so well', 'Not at all well']);
                answers2.set('understandableTreeGraph', ['Not at all understandable', 'Slightly understandable', 'Moderately understandable', 'Very understandable', 'Extremely understandable']);
                answers2.set('usefulTreeGraph', ['Not at all useful', 'Slightly useful', 'Moderately useful', 'Very useful', 'Extremely useful']);
                answers2.set('improveTreeGraph', null);
                answers2.set('mostAppealing', null);
                answers2.set('easiestPart', null);
                answers2.set('hardestPart', null);
                answers2.set('surprisingUnexpected', null);
                answers2.set('toImproveConsent', null);
                answers2.set('howEasyUse', null);
                answers2.set('featureImportantMost', null);
                answers2.set('featureImportantLeast', null);
                answers2.set('keepUsing', null);

                qstn += this.saveQuestionnaire(y, userd, questions2, answers2, 'Questionnaire2');

                qsn2.unsubscribe();




                const file = new File([qstn], `${this.getUserName(userd)}.txt`, {type: 'text/plain;charset=utf-8'});
                FileSaver.saveAs(file);
            });
        });
    }

    private saveQuestionnaire(data: QuestionnaireItem[], user, questions, answers, header) {
        if (!data) {
            data = [];
        }
        let result = header + '\u000d';
        data.forEach(x => {
            if (!questions.get(x.questionCode)) {
                return;
            }
            try {
                let tmp = '';
                tmp += questions.get(x.questionCode) + '\u000d';

                const answrs = answers.get(x.questionCode);
                if (answrs instanceof Array) {
                    tmp += '    - ' + answers.get(x.questionCode)[parseInt(x.answer.value, 10) - 1] + '\u000d';
                } else if (answrs === null) {
                    tmp += '    - ' + x.answer.value + '\u000d';
                } else if (x.questionCode === 'wordsDescribe' || x.questionCode === 'usefulTab' || x.questionCode === 'notUsefulTab') {
                    tmp += '    - ';
                    _.forIn(x.answer, (value, key) => {
                        if (x.answer[key] === true) {
                            tmp += '"' + answrs[key] + '", ';
                        }
                    });
                    tmp += '\u000d';
                } else if (x.questionCode === 'agreeingToProcessed') {
                    _.forIn(x.answer, (value, key) => {
                        tmp += '    - ' + answrs[key] + ': "' + x.answer[key] + '" \u000d';
                    });
                    tmp += '\u000d';
                }

                result += tmp;
            } catch (error) {}
        });

        return result;
    }

    private saveSteps(data, counter, user) {
        if (!data[0].acceptedItems) {
            data[0].acceptedItems = [];
        }
        const result = {
            payload: JSON.stringify(data),
            preloadedState: '{"mode":"wizard","groups":[],"selectedGroup":null,"selectedItem":null,"acceptedItems":[],"selectedItemExpanded":null,"items":[],"filteredItems":[],"pathItems":[],"loginErrorMessage":null,"userId":null}'
        };
        const file = new File([JSON.stringify(result)], `${this.getUserName(user)}_${counter}.json`, {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(file);
    }

    getUserName(user) {
        return user.dateString + '__' + user.email.slice(0, user.email.indexOf('@'));
    }
}
