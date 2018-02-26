import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './pages/admin/admin.component';
import { AgentComponent } from './pages/agent/agent.component';
import { BubblesComponent } from './pages/bubbles/bubbles.component';
import { HelpComponent } from './pages/help/help.component';
import { IntroComponent } from './pages/intro/intro.component';
import { LoginComponent } from './pages/login/login.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { PostQuestionnaireComponent } from './pages/questionnaire/post-questionnaire.component';
import { PreQuestionnaireComponent } from './pages/questionnaire/pre-questionnaire.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { AdminAuthGuard } from './shared/service/admin-auth-guard.service';
import { AuthGuard } from './shared/service/auth-guard.service';

const routes: Routes = [
    { path: '', component: IntroComponent, canActivate: [AuthGuard] },
    { path: 'demographic-data', component: PreQuestionnaireComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminAuthGuard] },
    { path: 'agent', component: AgentComponent, canActivate: [AuthGuard] },
    { path: 'wizard', component: WizardComponent, canActivate: [AuthGuard] },
    { path: 'bubbles', component: BubblesComponent, canActivate: [AuthGuard] },
    { path: 'questionnaire', component: PreQuestionnaireComponent, canActivate: [AuthGuard] },
    { path: 'post-questionnaire', component: PostQuestionnaireComponent, canActivate: [AuthGuard] },

    { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
    { path: 'thank-you', component: ThankYouComponent },
    { path: 'login', component: LoginComponent },
    { path: 'no-access', component: NoAccessComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        AuthGuard,
        AdminAuthGuard
    ],
})
export class AppRoutingModule { }
