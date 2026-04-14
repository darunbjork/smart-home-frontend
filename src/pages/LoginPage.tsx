import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export const LoginPage = () => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await auth.login(formData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err: unknown) { // Renamed err to _err to fix unused variable linting issue
      // Direct, brutal error handling
      setError("Invalid credentials or server unreachable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-[var(--space-4)]">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[var(--bg-surface)] p-[var(--space-8)] rounded-[var(--space-3)] border border-[var(--border)] flex flex-col gap-[var(--space-6)] animate-slide-up"
      >
        <div className="text-center">
          <h1 className="text-[var(--text-3xl)] font-[var(--weight-bold)]">Welcome Back</h1>
          <p className="text-[var(--text-secondary)]">Sign in to manage your home</p>
        </div>

        <div className="flex flex-col gap-[var(--space-4)]">
          <div className="flex flex-col gap-[var(--space-2)]">
            <label className="text-[var(--text-sm)] text-[var(--text-secondary)]">Email</label>
            <input 
              type="email"
              required
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--space-1)] p-[var(--space-3)] focus:border-[var(--brand)] outline-none transition-colors"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-[var(--space-2)]">
            <label className="text-[var(--text-sm)] text-[var(--text-secondary)]">Password</label>
            <input 
              type="password"
              required
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--space-1)] p-[var(--space-3)] focus:border-[var(--brand)] outline-none transition-colors"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <p className="text-[var(--error)] text-[var(--text-sm)] text-center">{error}</p>
        )}

        <Button type="submit" loading={isSubmitting} variant="primary">
          Sign In
        </Button>
      </form>
    </div>
  );
};
