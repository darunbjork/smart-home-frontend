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
      <Route path="/" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage /> 
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />

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
