import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { Dashboard } from "./pages/Dashboard";
import { MainLayout } from "./components/layout/MainLayout";
import { SettingsPage } from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes: Only accessible if NOT logged in */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <div className="p-10 text-center">Register Page (TBD)</div>
          </PublicRoute>
        } />

        {/* Protected Routes: Only accessible if logged in */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout> {/* Wrap Dashboard with MainLayout */}
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Add the Settings page route */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all: Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
