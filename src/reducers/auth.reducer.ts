import type { AuthState, User } from "../types/auth.types";

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; accessToken: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "REFRESH_TOKEN"; payload: string };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { 
        ...state, 
        user: action.payload.user, 
        accessToken: action.payload.accessToken, 
        isLoading: false 
      };
    case "LOGOUT":
      return { 
        user: null, 
        accessToken: null, 
        isLoading: false 
      };
    case "REFRESH_TOKEN":
      return { 
        ...state, 
        accessToken: action.payload 
      };
    case "SET_LOADING":
      return { 
        ...state, 
        isLoading: action.payload 
      };
    default:
      return state;
  }
}