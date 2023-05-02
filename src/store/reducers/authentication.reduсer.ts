import { AuthenticationUnion } from "../actions/authentication.actions";
import { AuthenticationTypes } from "../types/authentication.types";
import { AppRootTypes } from "../types/app-root.types";
import { AppRootUnion } from "../actions/app-root.actions";

export interface State {
  loading?: boolean;
  authenticated?: boolean;
  error?: string | null;
}

const INITIAL_STATE = {} as State;

export function authenticationReducer(
  state: State = INITIAL_STATE,
  action: AuthenticationUnion | AppRootUnion
) {
  switch (action.type) {
    case AuthenticationTypes.RegistrationRequest: {
      return {
        ...state,
        loading: true
      };
    }

    case AuthenticationTypes.RegistrationSuccess: {
      return {
        ...state,
        loading: false,
        authenticated: true
      };
    }

    case AuthenticationTypes.AuthorizationRequest: {
      return {
        ...state,
        loading: true
      };
    }

    case AuthenticationTypes.AuthorizationSuccess: {
      return {
        ...state,
        loading: false,
        authenticated: true
      };
    }

    case AuthenticationTypes.AuthenticationError: {
      return {
        ...state,
        loading: false,
        authenticated: false,
        error: 'error 902'
      };
    }

    case AuthenticationTypes.AuthenticationLogoutRequest: {
      return {
        ...state,
        loading: true
      };
    }

    case AuthenticationTypes.AuthenticationLogoutSuccess: {
      return {
        ...state,
        loading: false,
        authenticated: false
      };
    }

    case AppRootTypes.ErrorOccurred: {
      return {
        ...state,
        loading: false
      }
    }

    default: {
      return {
        ...state,
        loading: false
      };
    }
  }
}
