import { type ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) return null; // Safety check for context

  // 1. Still verifying the session? Show nothing (or a skeleton)
  if (auth.state.isLoading) {
    return <div className="min-h-screen bg-(--bg-primary) animate-pulse" />;
  }

  // 2. Not logged in? Redirect to login but save the current location
  if (!auth.state.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
