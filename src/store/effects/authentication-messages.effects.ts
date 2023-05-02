import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SnackbarService } from '../../services/snackbar.service';
import * as authenticationActions from '../actions/authentication.actions';
import { AuthenticationTypes } from '../types/authentication.types';
import { tap } from 'rxjs';
import { AuthorizationSuccess, RegistrationSuccess } from '../actions/authentication.actions';
import { AuthenticationMessages } from '../../enums/authentication-messages.enum';

@Injectable()
export class AuthenticationMessagesEffects {
  registrationSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<authenticationActions.RegistrationSuccess>(AuthenticationTypes.RegistrationSuccess),
      tap(() =>
        this.snackbarService.showMessage(AuthenticationMessages.RegistrationSuccess)
      )
    )
  },
    { dispatch: false }
  );

  authorizationSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType<authenticationActions.AuthorizationSuccess>(AuthenticationTypes.AuthorizationSuccess),
        tap(() =>
          this.snackbarService.showMessage(AuthenticationMessages.AuthorizationSuccess)
        )
      )
    },
    { dispatch: false }
  );

  authenticationLogoutSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType<authenticationActions.AuthenticationLogoutSuccess>(AuthenticationTypes.AuthenticationLogoutSuccess),
        tap(() =>
          this.snackbarService.showMessage(AuthenticationMessages.AuthenticationLogoutSuccess)
        )
      )
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private snackbarService: SnackbarService
  ) {
  }
}
