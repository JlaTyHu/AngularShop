import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as itemActions from '../actions/item.actions';
import { ItemTypes } from '../types/item.types';
import { from, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../app-state';
import { ErrorOccurredService } from '../../services/error-occurred.service';
import { AppRootErrorOccurred } from '../actions/app-root.actions';
import { AppRootTypes } from '../types/app-root.types';
import { ItemManagerService } from '../../services/item-manager.service';
import { CreateItemSuccess, DeleteItemSuccess, EditItemSuccess } from '../actions/item.actions';

@Injectable()
export class ItemEffects {
  errorOccurred$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AppRootErrorOccurred>(AppRootTypes.ErrorOccurred),
        tap((action) => console.log('@@ er a ', action)),
        tap((action) => this.errorOccurredService.openErrorDialog(action.payload))
      ),
    {dispatch: false}
  );

  createItemRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<itemActions.CreateItemRequest>(ItemTypes.CreateItemRequest),
      switchMap((action) =>
        from(
          this.createItemService.addItem(action.payload)
            .then(() => new CreateItemSuccess())
            .catch((error: any) => new AppRootErrorOccurred(error))
        )
      )
    )
  });

  deleteItemRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<itemActions.DeleteItemRequest>(ItemTypes.DeleteItemRequest),
      switchMap((action) =>
        from(
          this.createItemService.removeItem(action.payload.productId)
            .then(() => new DeleteItemSuccess())
            .catch((error: any) => new AppRootErrorOccurred(error))
        )
      )
    );
  });

  editItemRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType<itemActions.EditItemRequest>(ItemTypes.EditItemRequest),
      switchMap((action) =>
        from(
          this.createItemService.editItem(action.payload)
            .then(() => new EditItemSuccess())
            .catch((error: any) => new AppRootErrorOccurred(error))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private createItemService: ItemManagerService,
    private errorOccurredService: ErrorOccurredService
  ) {
  }
}
