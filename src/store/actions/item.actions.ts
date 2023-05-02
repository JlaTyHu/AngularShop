import { Action } from "@ngrx/store";
import { IUser } from "../../interfaces/user";
import { ItemTypes } from '../types/item.types';
import { ProductItem } from '../../models/product-item';

export class CreateItemRequest implements Action {
  readonly type = ItemTypes.CreateItemRequest;
  constructor(public payload: ProductItem) { }
}

export class CreateItemSuccess implements Action {
  readonly type = ItemTypes.CreateItemSuccess;
  constructor() { }
}

export class DeleteItemRequest implements Action {
  readonly type = ItemTypes.DeleteItemRequest;
  constructor(public payload: ProductItem) { }
}

export class DeleteItemSuccess implements Action {
  readonly type = ItemTypes.DeleteItemSuccess;
  constructor() { }
}

export class EditItemRequest implements Action {
  readonly type = ItemTypes.EditItemRequest;
  constructor(public payload: ProductItem) { }
}

export class EditItemSuccess implements Action {
  readonly type = ItemTypes.EditItemSuccess;
  constructor() { }
}


export type ItemUnion = CreateItemRequest
  | CreateItemSuccess
  | DeleteItemRequest
  | DeleteItemSuccess
  | EditItemRequest
  | EditItemSuccess;
