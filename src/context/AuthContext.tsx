import { useReducer, type ReactNode } from "react";
import { authApi } from "../api/auth.api";
import { tokenUtils } from "../utils/token";
import { AuthContext, type AuthContextValue, initialState } from "./AuthContextSetup";
import { authReducer } from "../reducers/auth.reducer";
import type { LoginDto, RegisterDto } from "../types/auth.types";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (dto: LoginDto): Promise<void> => {
    // 1. Call the API
    const { accessToken, user } = await authApi.login(dto);
    
    // 2. THE NAIVE WAY (Don't do this):
    // dispatch({ type: "LOGIN_SUCCESS", payload: { user, accessToken } })
    // If we only update React state, hitting F5 (refresh) wipes the memory. You are logged out immediately.

    // 3. THE FIXED WAY (Step 5):
    tokenUtils.set(accessToken); // Persist across refreshes
    dispatch({ type: "LOGIN_SUCCESS", payload: { user, accessToken } });
  };

  const register = async (dto: RegisterDto): Promise<void> => {
    await authApi.register(dto);
    // After registration, we automatically log them in
    await login({ email: dto.email, password: dto.password });
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout(); // Tells the backend to clear the HttpOnly refresh cookie
    } catch (error: unknown) {
      console.error("Logout failed on server, clearing local state anyway.", error);
    } finally {
      tokenUtils.clear();     // Wipe local access token
      dispatch({ type: "LOGOUT" });
    }
  };

  // Type assertion needed because AuthContext can be null initially
  const contextValue: AuthContextValue = { state, dispatch, login, logout, register };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
