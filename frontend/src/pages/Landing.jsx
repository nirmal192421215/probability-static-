import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Brain, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, TrendingUp, Cpu, Database, Activity } from "lucide-react";
import { api } from "../api";

function Counter({ value, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    const steps = 30;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setN(Math.round((target * i) / steps));
      if (i >= steps) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [value]);
  return (
    <span>
      {n}
      {suffix}
    </span>
  );
}

function AnalyticsArt() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-900 to-navy-950 p-6 text-white border border-white/10 shadow-2xl">
      {/* Background glow orb */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
      
      {/* Header simulator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-slate-400">eduwise-probability-engine v2.4</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE MODEL
        </div>
      </div>

      {/* Top metrics preview */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/[0.04] p-3.5 border border-white/[0.08] backdrop-blur-md">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Pass Probability</p>
          <p className="mt-1 text-2xl font-bold font-display text-emerald-400">89.4%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-3.5 border border-white/[0.08] backdrop-blur-md">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Academic Risk</p>
          <p className="mt-1 text-2xl font-bold font-display text-cyan-400">LOW</p>
          <p className="mt-2 text-[10px] text-slate-400">Posterior P: 0.11</p>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-accent-600 to-blue-700 p-3.5 border border-white/20 shadow-glow">
          <p className="text-[10px] font-medium uppercase tracking-wider text-blue-100">Prediction</p>
          <p className="mt-1 text-2xl font-bold font-display text-white">EXCELLENT</p>
          <p className="mt-2 text-[10px] text-blue-100 font-mono">GPA: 8.6 / 10</p>
        </div>
      </div>

      {/* Chart Canvas preview */}
      <div className="mt-5 rounded-2xl bg-white/[0.02] p-4 border border-white/[0.05]">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Normal Distribution Curve &amp; Probability Density</span>
          <span className="font-mono text-cyan-400">Z = +1.42 (p = 0.922)</span>
        </div>
        
        {/* SVG Curve */}
        <svg viewBox="0 0 460 140" className="mt-3 w-full overflow-visible">
          <defs>
            <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="0" y1="120" x2="460" y2="120" stroke="#ffffff15" strokeWidth="1" />
          <line x1="0" y1="70" x2="460" y2="70" stroke="#ffffff10" strokeDasharray="4 4" />
          <line x1="230" y1="20" x2="230" y2="120" stroke="#38BDF850" strokeDasharray="3 3" />
          
          {/* Area Fill */}
          <path
            d="M 20 120 Q 140 118 200 60 Q 230 20 260 60 Q 320 118 440 120 Z"
            fill="url(#curveGrad)"
          />
          
          {/* Line Curve */}
          <path
            d="M 20 120 Q 140 118 200 60 Q 230 20 260 60 Q 320 118 440 120"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="3"
          />
          
          {/* Target marker */}
          <circle cx="290" cy="78" r="6" fill="#22D3EE" className="animate-pulse" />
          <line x1="290" y1="78" x2="290" y2="120" stroke="#22D3EE" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>

        <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-500">
          <span>-3σ (40%)</span>
          <span>μ = 72.5%</span>
          <span>Target = 80%</span>
          <span>+3σ (98%)</span>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api("/api/dashboard/public-stats")
      .then(setStats)
      .catch(() =>
        setStats({ totalStudents: 24, averageMarks: 68, averageAttendance: 72, predictionAccuracy: 79 })
      );
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-navy-900 to-accent-600 text-white shadow-soft">
              <Sparkles size={18} />
            </div>
            <span className="font-bold tracking-tight text-navy-950 font-display text-xl">EduWise</span>
          </div>
          <div className="flex items-center gap-3">
            <Link className="btn-secondary text-xs sm:text-sm" to="/login">
              Sign in
            </Link>
            <Link className="btn-accent text-xs sm:text-sm" to="/register">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Decorative Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-12">
          {/* Left Column: Hero Pitch */}
          <div className="animate-fade-up lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3.5 py-1 text-xs font-semibold text-accent-600 mb-6">
              <Sparkles size={14} className="text-accent-600" />
              <span>Probability &amp; Statistical Models Capstone</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.15] text-navy-950 font-display sm:text-5xl lg:text-6xl">
              Predict Student Success with <span className="bg-gradient-to-r from-accent-600 to-cyan-500 bg-clip-text text-transparent">Probability Models</span>
            </h1>

            <p className="mt-6 text-base text-slate-600 leading-relaxed sm:text-lg">
              Transform academic telemetry into dynamic statistical measures, estimate risk probabilities with Bayes' Theorem, and recommend actionable interventions before finals.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link className="btn-primary px-7 py-3 text-base" to="/login">
                Explore Dashboard <ArrowRight size={16} />
              </Link>
              <Link className="btn-secondary px-6 py-3 text-base" to="/login">
                View Live Models
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Bayes' Theorem</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Normal &amp; Binomial CDF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Automated PDF Reports</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Art */}
          <div className="animate-fade-up lg:col-span-6" style={{ animationDelay: "150ms" }}>
            <AnalyticsArt />
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display text-navy-950 sm:text-4xl">
              Powerful Academic Intelligence
            </h2>
            <p className="mt-3 text-slate-600">
              Built using rigorous mathematical methods to forecast academic results with confidence intervals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                icon: BarChart3, 
                t: "Descriptive Statistics", 
                d: "Dynamic calculation of Mean, Median, Mode, Standard Deviation, and Quartiles from student records.",
                badge: "Module 1"
              },
              { 
                icon: Brain, 
                t: "Probability Models", 
                d: "Conditional probability P(A|B) and Bayes' Theorem risk estimations based on attendance and study habits.",
                badge: "Module 2"
              },
              { 
                icon: ShieldAlert, 
                t: "Risk Analysis Matrix", 
                d: "Three-tier risk segmentation (Low, Medium, High) with immediate intervention recommendations.",
                badge: "Module 3"
              },
              { 
                icon: Sparkles, 
                t: "AI Guidance Engine", 
                d: "Targeted subject-level coaching points, attendance improvement thresholds, and study hour targets.",
                badge: "Module 4"
              },
            ].map((f) => (
              <div key={f.t} className="card-interactive p-6 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl bg-accent-500/10 p-3 text-accent-600 transition-colors group-hover:bg-accent-600 group-hover:text-white">
                    <f.icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-bold text-navy-950 font-display text-lg">{f.t}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mathematical Pipeline (How It Works) ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display text-navy-950 sm:text-4xl">
              How The Probability Engine Works
            </h2>
            <p className="mt-3 text-slate-600">
              From raw classroom records to personalized intervention in 4 automated stages.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4 relative">
            {[
              { step: "01", title: "Collect Telemetry", desc: "Internal marks, attendance %, assignment consistency, and prior GPA." },
              { step: "02", title: "Statistical Baseline", desc: "Calculate cohort variance, mean deviations, and correlation coefficients." },
              { step: "03", title: "Probability Modeling", desc: "Apply Normal distributions, Bayes posterior probability, and binomial pass rates." },
              { step: "04", title: "Intervene & Guide", desc: "Generate actionable advice cards and export PDF reports for academic viva." },
            ].map((s, i) => (
              <div key={s.step} className="card p-6 relative text-center group hover:border-accent-400 transition-all">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-900 to-accent-600 text-white font-display font-bold text-lg shadow-soft group-hover:shadow-glow transition-all">
                  {s.step}
                </div>
                <h3 className="font-bold text-navy-950 font-display text-base">{s.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Performance Counters ── */}
      <section className="py-16 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Students Analyzed</p>
              <p className="mt-2 text-4xl font-bold font-display text-white">
                <Counter value={stats?.totalStudents || 24} />
              </p>
              <p className="mt-1 text-xs text-slate-400">Live MongoDB records</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Cohort Average</p>
              <p className="mt-2 text-4xl font-bold font-display text-white">
                <Counter value={stats?.averageMarks || 66} suffix="%" />
              </p>
              <p className="mt-1 text-xs text-slate-400">Mean academic score</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Average Attendance</p>
              <p className="mt-2 text-4xl font-bold font-display text-white">
                <Counter value={stats?.averageAttendance || 73} suffix="%" />
              </p>
              <p className="mt-1 text-xs text-slate-400">Across all departments</p>
            </div>

            <div className="rounded-2xl bg-white/[0.04] p-6 border border-white/10 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Model Accuracy</p>
              <p className="mt-2 text-4xl font-bold font-display text-white">
                <Counter value={stats?.predictionAccuracy || 88} suffix="%" />
              </p>
              <p className="mt-1 text-xs text-slate-400">Probability calibration</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-accent-600 p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-extrabold font-display sm:text-4xl">
              Ready to Explore the Analytics Platform?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Sign in with Administrator, Faculty, or Student demo credentials to test the full suite of probability models.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link className="btn-accent px-8 py-3 text-base shadow-glowCyan" to="/login">
                Access Dashboard <ArrowRight size={16} />
              </Link>
              <Link className="btn-secondary px-8 py-3 text-base bg-white/10 border-white/20 text-white hover:bg-white/20" to="/register">
                Register New Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-400">
        EduWise Academic Intelligence · Probability &amp; Statistics Capstone System
      </footer>
    </div>
  );
}
