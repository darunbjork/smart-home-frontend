import { useReducer, type ReactNode, useEffect } from "react";
import { authApi } from "../api/auth.api";
import { tokenUtils } from "../utils/token";
import { AuthContext, type AuthContextValue, initialState } from "./AuthContextSetup";
import { authReducer } from "../reducers/auth.reducer";
import type { LoginDto, RegisterDto } from "../types/auth.types";
import { useNavigate } from "react-router-dom";

export { AuthContext };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenUtils.getToken();
      const user = tokenUtils.getUser();
      if (token && user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: { user, accessToken: token } });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    restoreSession();
  }, [dispatch, navigate]);

  const login = async (dto: LoginDto): Promise<void> => {
    const { accessToken, user } = await authApi.login(dto);
    tokenUtils.setToken(accessToken);
    tokenUtils.setUser(user);
    dispatch({ type: "LOGIN_SUCCESS", payload: { user, accessToken } });
    navigate('/dashboard');
  };

  const register = async (dto: RegisterDto) => {
    await authApi.register(dto);
    await login({ email: dto.email, password: dto.password });
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) { 
      console.error("Logout failed on server, clearing local state anyway.", error);
    } finally {
      tokenUtils.clear();
      dispatch({ type: "LOGOUT" });
    }
  };

  const contextValue: AuthContextValue = { state, dispatch, login, logout, register };
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
