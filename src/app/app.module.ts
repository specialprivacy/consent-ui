import { DevToolsExtension, NgRedux, NgReduxModule } from '@angular-redux/store';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { isDevMode, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    MatTabsModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import * as _ from 'lodash';
import { createLogger } from 'redux-logger';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AgentComponent } from './pages/agent/agent.component';
import { BubblesComponent } from './pages/bubbles/bubbles.component';
import { HomeComponent } from './pages/home/home.component';
import { IntroComponent } from './pages/intro/intro.component';
import { LoginComponent } from './pages/login/login.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { PostQuestionnaireComponent } from './pages/questionnaire/post-questionnaire.component';
import { PreQuestionnaireComponent } from './pages/questionnaire/pre-questionnaire.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { GraphComponent } from './pages/wizard/graph/graph.component';
import { PopupDialogComponent } from './pages/wizard/popup/popup';
import { RequestComponent } from './pages/wizard/request/request.component';
import { VideoComponent } from './pages/wizard/video/video.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { ConcentRequestActions } from './redux/actions';
import { ItemActions } from './redux/actions/item.actions';
import { SessionActions } from './redux/actions/session.actions';
import { INITIAL_STATE } from './redux/store';
import { IAppState, rootReducer } from './redux/store';
import { AuthService } from './shared/service/auth.service';
import { DataService } from './shared/service/data.service';
import { ItemService } from './shared/service/item.service';
import { QuestionnaireService } from './shared/service/questionnaire.service';
import { TrackingService } from './shared/service/tracking.service';
import { UserService } from './shared/service/user.service';
import { HelpComponent } from './pages/help/help.component';
import { InfoDialogComponent } from './shared/components/dialogs/info.dialog.component';
import { SummaryDialogComponent } from './shared/components/dialogs/summary.dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        AgentComponent,
        WizardComponent,
        BubblesComponent,
        RequestComponent,
        PopupDialogComponent,
        InfoDialogComponent,
        SummaryDialogComponent,
        VideoComponent,
        GraphComponent,
        HomeComponent,
        LoginComponent,
        NoAccessComponent,
        PreQuestionnaireComponent,
        PostQuestionnaireComponent,
        IntroComponent,
        ThankYouComponent,
        AdminComponent,
        HelpComponent
    ],
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatListModule,
        MatTableModule,
        BrowserModule,
        MatTooltipModule,
        MatCardModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatGridListModule,
        MatCommonModule,
        MatDialogModule,
        CommonModule,
        NgReduxModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatIconModule,
        MatTabsModule
    ],
    providers: [
        DataService,
        ConcentRequestActions,
        AuthService,
        MockBackend,
        BaseRequestOptions,
        AngularFireAuth,
        AngularFireDatabase,
        UserService,
        ItemActions,
        ItemService,
        SessionActions,
        TrackingService,
        QuestionnaireService
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        PopupDialogComponent,
        InfoDialogComponent,
        SummaryDialogComponent
    ]
})
export class AppModule {
    constructor(
        devTools: DevToolsExtension,
        trackingService: TrackingService,
        ngRedux: NgRedux<IAppState>) {

        const logger = createLogger(
            {
            titleFormatter: (action: any, time: string, took: number) => {
                return action.type;
            },
            logger: {
                log: function(name, style, action) {
                    if (_.startsWith(name, '%c action')) {
                        trackingService.track(action);
                    }
                }
            }
        }
    );

        const enhancers = isDevMode() ? [devTools.enhancer()] : [];
        ngRedux.configureStore(rootReducer, INITIAL_STATE, [logger], []);
    }
}
