import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { OwnerGuard } from "./components/auth/OwnerGuard";
import { Button } from "./components/ui/Button";


// Temporary placeholder for the Dashboard
const DashboardPlaceholder = () => (
  <div className="p-[var(--space-8)] flex flex-col gap-4">
    <h1 className="text-[var(--text-3xl)]">Household Dashboard</h1>
    
    <OwnerGuard fallback={<p className="text-[var(--text-muted)] text-sm">Read-only Member View</p>}>
       <Button variant="destructive">Delete Household (Owner Only)</Button>
    </OwnerGuard>
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
            <div className="p-10 text-center">Register Page (TBD)</div>
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
