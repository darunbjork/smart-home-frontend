import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { Dashboard } from "./pages/Dashboard";
import { MainLayout } from "./components/layout/MainLayout";
import { SettingsPage } from "./pages/SettingsPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/* Root path '/' now renders LoginPage for unauthenticated users via PublicRoute.
          The LoginPage component itself should handle redirection to '/dashboard' if the user is already authenticated. */}
      <Route path="/" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      {/* Login route remains public, could potentially redirect to '/' if desired, 
          but serving LoginPage directly is also common. */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage /> 
        </PublicRoute>
      } />

      {/* Register route remains public. The RegisterPage component should link to '/' for sign-in. */}
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Dashboard is now on a dedicated protected path */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Settings page remains protected */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Catch-all route:
          Redirects unknown paths to the root ('/'), which is the LoginPage for unauthenticated users.
          Authenticated users hitting '*' are expected to be handled by LoginPage's post-login redirect,
          or by ProtectedRoute logic on target routes.
      */}
      <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}

export default App;
