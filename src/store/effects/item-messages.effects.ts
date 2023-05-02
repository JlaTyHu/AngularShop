import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SnackbarService } from '../../services/snackbar.service';
import * as itemActions from '../actions/item.actions';
import { ItemTypes } from '../types/item.types';
import { tap } from 'rxjs';
import { ItemMessages } from '../../enums/item-messages.enum';

@Injectable()
export class ItemMessagesEffects {
  createItemSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType<itemActions.CreateItemSuccess>(ItemTypes.CreateItemSuccess),
        tap(() =>
          this.snackbarService.showMessage(ItemMessages.CreateItemSuccess)
        )
      )
    },
    { dispatch: false }
  );

  deleteItemSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType<itemActions.DeleteItemSuccess>(ItemTypes.DeleteItemSuccess),
        tap(() =>
          this.snackbarService.showMessage(ItemMessages.DeleteItemSuccess)
        )
      )
    },
    { dispatch: false }
  );

  editItemSuccess$ = createEffect(() => {
      return this.actions$.pipe(
        ofType<itemActions.DeleteItemSuccess>(ItemMessages.EditItemSuccess),
        tap(() =>
          this.snackbarService.showMessage(ItemMessages.EditItemSuccess)
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
