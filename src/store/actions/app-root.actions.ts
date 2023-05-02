import { Action } from "@ngrx/store";
import { AppRootTypes } from "../types/app-root.types";

export class AppRootErrorOccurred implements Action {
  readonly type = AppRootTypes.ErrorOccurred;
  constructor(public payload: any) { }
}

export type AppRootUnion = AppRootErrorOccurred;
