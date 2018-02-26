import { NgRedux } from '@angular-redux/store';
import { Injectable } from '@angular/core';

import { AuthService } from '../../shared/service/auth.service';
import { IAppState } from '../store';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';

@Injectable()
export class WizardActions {
    static SESSION_NOT_COMPLETED = 'SESSION_NOT_COMPLETED';
    static SESSION_COMPLETED = 'SESSION_COMPLETED';

    constructor(private ngRedux: NgRedux<IAppState>) {}

    complete() {
        const state = this.ngRedux.getState();
        _.isEmpty(state.acceptedItems)
            ? this.dispatch(WizardActions.SESSION_NOT_COMPLETED)
            : this.dispatch(WizardActions.SESSION_COMPLETED);
    }

    private dispatch(type: string) {
        this.ngRedux.dispatch({ type: type });
    }
}
