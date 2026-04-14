import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";

// Temporary placeholder for the Dashboard
const DashboardPlaceholder = () => (
  <div className="p-[var(--space-8)]">
    <h1 className="text-[var(--text-3xl)]">Dashboard</h1>
    <p className="text-[var(--text-secondary)]">Secure content goes here.</p>
  </div>
);

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
            <div className="text-center p-10">Register Page (TBD)</div>
          </PublicRoute>
        } />

        {/* Protected Routes: Only accessible if logged in */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        } />

        {/* Catch-all: Redirect unknown paths to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
