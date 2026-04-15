import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

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
    } catch (_err: unknown) {
      setError("Invalid credentials or server unreachable.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) p-(--space-4)">
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-(--bg-surface) p-(--space-8) rounded-(--space-3) border border-(--border) flex flex-col gap-(--space-6) animate-slide-up"
      >
        <div className="text-center">
          <h1 className="text-(--text-3xl) font-(--weight-bold)">Welcome Back</h1>
          <p className="text-(--text-secondary)">Sign in to manage your home</p>
        </div>

        <div className="flex flex-col gap-(--space-4)">
          <div className="flex flex-col gap-(--space-2)">
            <label className="text-(--text-secondary)">Email</label>
            <input 
              type="email"
              required
              className="bg-(--bg-primary) border border-(--border) rounded-(--space-1) p-(--space-3) focus:border-(--brand) outline-none transition-colors"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-(--space-2)">
            <label className="text-(--text-sm)">Password</label>
            <input 
              type="password"
              required
              className="bg-(--bg-primary) border border-(--border) rounded-(--space-1) p-(--space-3) focus:border-(--brand) outline-none transition-colors"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <p className="text-(--text-sm) text-center">{error}</p>
        )}

        <Button type="submit" loading={isSubmitting} variant="primary">
          Sign In
        </Button>

        <p className="text-center text-(--text-sm)">
          Don't have an account?{" "}
          <Link to="/register" className="text-(--brand) hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
};
