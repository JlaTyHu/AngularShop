import { ItemUnion } from '../actions/item.actions';
import { ItemTypes } from '../types/item.types';

export interface State {
  loading?: boolean;
  isSuccessful?: boolean;
  error?: string | null;
}

const INITIAL_STATE = {} as State;

export function itemReducer(
  state: State = INITIAL_STATE,
  action: ItemUnion
) {
  switch (action.type) {
    case ItemTypes.CreateItemRequest:
      return { ...state, loading: true };
    case ItemTypes.CreateItemSuccess:
      return { ...state, loading: false, isSuccessful: true };

    case ItemTypes.DeleteItemRequest:
      return { ...state, loading: true };
    case ItemTypes.DeleteItemSuccess:
      return { ...state, loading: false, isSuccessful: true };

    case ItemTypes.EditItemRequest:
      return { ...state, loading: true };
    case ItemTypes.EditItemSuccess:
      return { ...state, loading: false, isSuccessful: true };

    default:
      return { ...state, loading: false };
  }
}
