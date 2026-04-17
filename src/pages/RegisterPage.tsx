import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export const RegisterPage = () => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await auth.register(formData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err: unknown) {
      setError("Registration failed. Email might already be in use.");
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
          <h1 className="text-(--text-3xl) font-(--weight-bold)">Create Account</h1>
          <p className="text-(--text-secondary)">Start managing your smart home today</p>
        </div>

        <div className="flex flex-col gap-(--space-4)">
          {/* Full Name Field */}
          <div className="flex flex-col gap-(--space-2)">
            <label className="text-(--text-sm)">Full Name</label>
            <input 
              type="text"
              required
              placeholder="John Doe"
              className="bg-(--bg-primary) border border-(--border) rounded-(--space-1) p-(--space-3) focus:border-(--brand) outline-none transition-colors"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-(--space-2)">
            <label className="text-(--text-secondary)">Email</label>
            <input 
              type="email"
              required
              placeholder="name@example.com"
              className="bg-(--bg-primary) border border-(--border) rounded-(--space-1) p-(--space-3) focus:border-(--brand) outline-none transition-colors"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className="flex flex-col gap-(--space-2)">
            <label className="text-(--text-secondary)">Password</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
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
          Create Account
        </Button>

        <p className="text-center text-(--text-sm)">
          Already have an account?{" "}
          <Link to="/login" className="text-(--brand) hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};
