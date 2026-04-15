import { createContext, useContext } from "react";
import { type AuthAction } from "../reducers/auth.reducer";
import type { AuthState, LoginDto, RegisterDto } from "../types/auth.types";

export interface AuthContextValue {
  state:    AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login:    (dto: LoginDto)    => Promise<void>;
  logout:   ()                 => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const initialState: AuthState = {
  user:        null,
  accessToken: null,
  isLoading:   true, // * Start true so we don't flash a login screen during initial check
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
