import React, { createContext, useReducer, type ReactNode } from "react";
import { authReducer, type AuthAction } from "../reducers/auth.reducer";
import type { AuthState, LoginDto, RegisterDto } from "../types/auth.types";

export interface AuthContextValue {
  state:    AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login:    (dto: LoginDto)    => Promise<void>;
  logout:   ()                 => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: AuthState = {
  user:        null,
  accessToken: null,
  isLoading:   true, // * Start true so we don't flash a login screen during initial check
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (dto: LoginDto): Promise<void> => { console.log("Login stub", dto); };
  const register = async (dto: RegisterDto): Promise<void> => { console.log("Register stub", dto); };
  const logout = async (): Promise<void> => { console.log("Logout stub"); };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};