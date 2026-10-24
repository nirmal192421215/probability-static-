import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { user, register } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Faculty" });
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/app/dashboard" replace />;

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      nav("/app/dashboard");
    } catch (err) {
      push(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4 py-12 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Brand header */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-navy-900 to-accent-600 text-white shadow-glow">
              <Sparkles size={20} />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-navy-950">EduWise</span>
          </Link>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Probability &amp; Statistical Models System
          </p>
        </div>

        <form onSubmit={onSubmit} className="card-glass p-8 bg-white/95 shadow-2xl border border-white/80">
          <h1 className="text-2xl font-bold font-display text-navy-950">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Register to access the educational intelligence platform</p>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <input
                className="input mt-1.5"
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Dr. Alex Rivera"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <input
                className="input mt-1.5"
                type="text"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="alex@eduwise.local"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <input
                className="input mt-1.5"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Account Role
              </label>
              <select className="input mt-1.5" value={form.role} onChange={(e) => set("role", e.target.value)}>
                <option>Student</option>
                <option>Faculty</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>

          <button className="btn-primary mt-6 w-full py-3 text-base" disabled={loading}>
            {loading ? "Creating account…" : "Register"} <ArrowRight size={16} />
          </button>
          
          <p className="mt-5 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link className="font-semibold text-accent-600 hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
