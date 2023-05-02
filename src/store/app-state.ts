import * as Authentication from './reducers/authentication.reduсer';
import * as Item from './reducers/item.reducer';
import { ActionReducerMap } from "@ngrx/store";

export interface State {
  authentication: Authentication.State;
  item: Item.State;
}

export const reducers: ActionReducerMap<State, any> = {
  authentication: Authentication.authenticationReducer,
  item: Item.itemReducer,
};
