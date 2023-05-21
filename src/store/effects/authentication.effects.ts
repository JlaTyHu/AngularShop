import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as authenticationActions from '../actions/authentication.actions';
import { AuthenticationTypes } from '../types/authentication.types';
import { from, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../app-state';
import {
  AuthenticationLogoutSuccess,
  AuthorizationSuccess,
  RegistrationSuccess
} from '../actions/authentication.actions';
import { ErrorOccurredService } from '../../services/error-occurred.service';
import { AppRootErrorOccurred } from '../actions/app-root.actions';
import { AppRootTypes } from '../types/app-root.types';

@Injectable()
export class AuthenticationEffects {
  errorOccurred$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AppRootErrorOccurred>(AppRootTypes.ErrorOccurred),
        tap((action) => this.errorOccurredService.openErrorDialog(action.payload))
      ),
    {dispatch: false}
  );

  registrationRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<authenticationActions.RegistrationRequest>(AuthenticationTypes.RegistrationRequest),
      switchMap((action) =>
        from(
          this.authenticationService.register(action.payload.login, action.payload.email, action.payload.password)
            .then(() => new RegistrationSuccess())
            .catch((error: any) => new AppRootErrorOccurred(error))
        )
      )
    )
  });

  authorizationRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<authenticationActions.AuthorizationRequest>(AuthenticationTypes.AuthorizationRequest),
      switchMap((action) =>
        from(
          this.authenticationService.login(action.payload.login, action.payload.email, action.payload.password)
            .then(() => new AuthorizationSuccess())
            .catch((error: any) => new AppRootErrorOccurred(error))
        )
      )
    );
  });

  authenticationLogoutRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<authenticationActions.AuthenticationLogoutRequest>(AuthenticationTypes.AuthenticationLogoutRequest),
      switchMap((action) =>
        from(this.authenticationService.logout()
          .then(() => new AuthenticationLogoutSuccess())
          .catch((error) => new AppRootErrorOccurred(error))
        )
      )
    )
  });

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private authenticationService: AuthenticationService,
    private errorOccurredService: ErrorOccurredService
  ) {
  }
}
