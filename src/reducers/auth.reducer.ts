/** 
| Action             | `type` (discriminator) | `payload` (data)                      | Purpose                      |
| ------------------ | ---------------------- | ------------------------------------- | ---------------------------- |
| **LOGIN\_SUCCESS** | `"LOGIN_SUCCESS"`      | `{ user: User; accessToken: string }` | User logged in successfully  |
| **LOGOUT**         | `"LOGOUT"`             | *(none)*                              | User logged out              |
| **SET\_LOADING**   | `"SET_LOADING"`        | `boolean`                             | Show/hide loading spinner    |
| **REFRESH\_TOKEN** | `"REFRESH_TOKEN"`      | `string` (new token)                  | Update access token silently |

 */

import type { AuthState, User } from "../types/auth.types";

// * The type property is a discriminator (or "tag") that tells TypeScript which shape the action object has. It's how the reducer knows what data is available.
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