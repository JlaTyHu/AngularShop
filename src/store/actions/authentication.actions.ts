import { Action } from "@ngrx/store";
import { AuthenticationTypes } from "../types/authentication.types";
import { IUser } from "../../interfaces/user";

export class RegistrationRequest implements Action {
  readonly type = AuthenticationTypes.RegistrationRequest;
  constructor(public payload: IUser) { }
}

export class RegistrationSuccess implements Action {
  readonly type = AuthenticationTypes.RegistrationSuccess;
  constructor() { }
}

export class AuthorizationRequest implements Action {
  readonly type = AuthenticationTypes.AuthorizationRequest;
  constructor(public payload: IUser) { }
}

export class AuthorizationSuccess implements Action {
  readonly type = AuthenticationTypes.AuthorizationSuccess;
  constructor() { }
}

export class AuthenticationError implements Action {
  readonly type = AuthenticationTypes.AuthenticationError;
  constructor() { }
}

export class AuthenticationLogoutRequest implements Action {
  readonly type = AuthenticationTypes.AuthenticationLogoutRequest;
  constructor() { }
}

export class AuthenticationLogoutSuccess implements Action {
  readonly type = AuthenticationTypes.AuthenticationLogoutSuccess;
  constructor() { }
}

export type AuthenticationUnion = RegistrationRequest
  | RegistrationSuccess
  | AuthorizationRequest
  | AuthorizationSuccess
  | AuthenticationError
  | AuthenticationLogoutRequest
  | AuthenticationLogoutSuccess;
