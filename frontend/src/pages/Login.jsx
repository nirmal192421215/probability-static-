import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Shield, GraduationCap, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../api";

export default function Login() {
  const { user, login } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@eduwise.local");
  const [password, setPassword] = useState("EduWise@123");
  const [remember, setRemember] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/app/dashboard" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, remember);
      nav("/app/dashboard");
    } catch (err) {
      push(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function sendReset(e) {
    e.preventDefault();
    try {
      const data = await api("/api/auth/forgot-password", { method: "POST", body: { email } });
      push(data.message);
      setForgot(false);
    } catch (err) {
      push(err.message, "error");
    }
  }

  function setDemoRole(roleEmail) {
    setEmail(roleEmail);
    setPassword("EduWise@123");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4 py-12 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />

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

        {/* Card */}
        <form onSubmit={onSubmit} className="card-glass p-8 bg-white/95 shadow-2xl border border-white/80">
          <h1 className="text-2xl font-bold font-display text-navy-950">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your EduWise analytics workspace</p>

          {/* 1-Click Role Quick Selectors */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Quick 1-Click Demo Login:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole("admin@eduwise.local")}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-all ${
                  email === "admin@eduwise.local"
                    ? "border-accent-500 bg-accent-500/10 text-accent-700 shadow-soft"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Shield size={14} className="text-blue-600" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole("faculty@eduwise.local")}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-all ${
                  email === "faculty@eduwise.local"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 shadow-soft"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Users size={14} className="text-emerald-600" />
                <span>Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoRole("student@eduwise.local")}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-semibold transition-all ${
                  email === "student@eduwise.local"
                    ? "border-amber-500 bg-amber-500/10 text-amber-700 shadow-soft"
                    : "border-slate-200 bg-white/60 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <GraduationCap size={14} className="text-amber-600" />
                <span>Student</span>
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <input
                className="input mt-1.5"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button 
              type="button" 
              className="font-semibold text-accent-600 hover:text-accent-700" 
              onClick={() => setForgot(true)}
            >
              Forgot password?
            </button>
          </div>

          <button className="btn-primary mt-6 w-full py-3 text-base" disabled={loading}>
            {loading ? "Signing in…" : "Sign in to Dashboard"} <ArrowRight size={16} />
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link className="font-semibold text-accent-600 hover:underline" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm animate-fade-up">
          <form onSubmit={sendReset} className="card-glass w-full max-w-sm p-6 bg-white/95 shadow-2xl">
            <h2 className="font-bold text-lg font-display text-navy-950">Reset password</h2>
            <p className="mt-1 text-xs text-slate-500">Enter your email to receive recovery instructions.</p>
            <input
              className="input mt-4"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@eduwise.local"
              required
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button type="button" className="btn-secondary" onClick={() => setForgot(false)}>
                Cancel
              </button>
              <button className="btn-primary">Send Reset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
