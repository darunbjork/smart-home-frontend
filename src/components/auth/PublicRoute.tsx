import { type ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (auth.state.user && !auth.state.isLoading) {
     return <Navigate to="/dashboard" replace />; 
  }

  return <>{children}</>;
};
