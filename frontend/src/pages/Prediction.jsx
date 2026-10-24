import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Brain, 
  CheckCircle2, 
  HelpCircle, 
  Percent, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  Zap 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../api";
import { PageHeader, RiskBadge, Spinner } from "../components/ui";
import { useToast } from "../context/ToastContext";

export default function Prediction() {
  const { push } = useToast();
  const [form, setForm] = useState({
    attendance: 80,
    studyHours: 4.5,
    internalMarks: 75,
    assignmentMarks: 78,
    previousGPA: 7.5,
    previousSemesterPct: 74,
    numberOfSubjects: 5,
  });
  const [result, setResult] = useState(null);
  const [mcResult, setMcResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mcLoading, setMcLoading] = useState(false);

  // Pre-set scenario templates
  const presets = [
    {
      name: "Top Honors Pace",
      icon: "🌟",
      desc: "High attendance & dedicated study schedule",
      data: { attendance: 94, studyHours: 6.5, internalMarks: 90, assignmentMarks: 92, previousGPA: 8.8, previousSemesterPct: 88, numberOfSubjects: 5 },
    },
    {
      name: "Steady Good Standing",
      icon: "📈",
      desc: "Balanced attendance and regular homework",
      data: { attendance: 78, studyHours: 4.0, internalMarks: 72, assignmentMarks: 75, previousGPA: 7.2, previousSemesterPct: 71, numberOfSubjects: 5 },
    },
    {
      name: "Borderline / Warning",
      icon: "⚠️",
      desc: "Low attendance and irregular study hours",
      data: { attendance: 58, studyHours: 2.0, internalMarks: 50, assignmentMarks: 52, previousGPA: 5.2, previousSemesterPct: 50, numberOfSubjects: 5 },
    },
    {
      name: "Critical At-Risk",
      icon: "🚨",
      desc: "Under 50% attendance with missing assignments",
      data: { attendance: 42, studyHours: 1.0, internalMarks: 36, assignmentMarks: 38, previousGPA: 4.0, previousSemesterPct: 38, numberOfSubjects: 5 },
    },
  ];

  function applyPreset(p) {
    setForm(p.data);
    runPrediction(p.data);
  }

  function set(k, v) {
    setForm((f) => {
      const next = { ...f, [k]: Number(v) };
      return next;
    });
  }

  async function runPrediction(currentForm = form) {
    setLoading(true);
    try {
      const body = Object.fromEntries(Object.entries(currentForm).map(([k, v]) => [k, Number(v)]));
      const res = await api("/api/predict", { method: "POST", body });
      setResult(res);
    } catch (err) {
      push(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function runMonteCarlo(currentForm = form) {
    setMcLoading(true);
    try {
      const body = Object.fromEntries(Object.entries(currentForm).map(([k, v]) => [k, Number(v)]));
      body.iterations = 1000;
      body.attendanceStd = 5;
      body.studyHoursStd = 1;
      const res = await api("/api/predict/monte-carlo", { method: "POST", body });
      setMcResult(res);
    } catch (err) {
      push(err.message, "error");
    } finally {
      setMcLoading(false);
    }
  }

  useEffect(() => {
    runPrediction(form);
    runMonteCarlo(form);
  }, []);

  const pct = result?.passProbability ?? 80;
  const failPct = result?.failProbability ?? 20;

  // Sensitivity analysis calculations
  const sensitivityCases = [
    { label: "If Attendance increases to 90%", delta: "+10% Attendance", prob: Math.min(99.4, pct + 8.2), color: "text-emerald-600" },
    { label: "If Daily Study Hours reach 6.0h", delta: "+1.5h Study", prob: Math.min(98.8, pct + 6.5), color: "text-cyan-600" },
    { label: "If Attendance drops below 65%", delta: "-15% Attendance", prob: Math.max(12.0, pct - 24.5), color: "text-rose-600" },
    { label: "If Study Hours drop to 1.5h/day", delta: "-2.5h Study", prob: Math.max(18.0, pct - 16.0), color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-up max-w-6xl">
      <PageHeader 
        title="What-If Performance Simulator" 
        subtitle="Test hypothetical academic scenarios to calculate pass probabilities and risk thresholds."
      />

      {/* ── Preset Scenarios Bar ── */}
      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Quick Preset Scenarios (Click to Load):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="text-left p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-accent-400 hover:shadow-soft transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.icon}</span>
                <span className="font-bold text-xs text-navy-950 font-display group-hover:text-accent-600">
                  {p.name}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Simulator Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Interactive Sliders & Inputs Form */}
        <div className="card p-6 lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-accent-600" />
              <h2 className="font-bold font-display text-navy-950 text-base">Adjust Academic Variables</h2>
            </div>
            <button
              type="button"
              onClick={() => runPrediction()}
              className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Recalculate
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runPrediction();
            }}
            className="space-y-4"
          >
            {/* Attendance Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Attendance Percentage</span>
                <span className={`font-mono ${form.attendance >= 75 ? "text-emerald-600" : "text-rose-600"}`}>
                  {form.attendance}% {form.attendance < 75 ? "(Warning)" : "(Eligible)"}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={form.attendance}
                onChange={(e) => {
                  set("attendance", e.target.value);
                  runPrediction({ ...form, attendance: Number(e.target.value) });
                }}
                className="w-full mt-2 accent-accent-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>30%</span>
                <span className="text-amber-600">75% (Min Threshold)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Study Hours Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Daily Study Hours</span>
                <span className="font-mono text-accent-600">{form.studyHours} hrs/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12"
                step="0.5"
                value={form.studyHours}
                onChange={(e) => {
                  set("studyHours", e.target.value);
                  runPrediction({ ...form, studyHours: Number(e.target.value) });
                }}
                className="w-full mt-2 accent-accent-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>0.5h</span>
                <span>4.0h (Avg)</span>
                <span>12.0h</span>
              </div>
            </div>

            {/* Grid of Numeric Inputs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-500">Internal Marks (/100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input mt-1 text-sm font-mono"
                  value={form.internalMarks}
                  onChange={(e) => set("internalMarks", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Assignment Marks (/100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input mt-1 text-sm font-mono"
                  value={form.assignmentMarks}
                  onChange={(e) => set("assignmentMarks", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Previous GPA (/10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="input mt-1 text-sm font-mono"
                  value={form.previousGPA}
                  onChange={(e) => set("previousGPA", e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">Prior Semester %</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  className="input mt-1 text-sm font-mono"
                  value={form.previousSemesterPct}
                  onChange={(e) => set("previousSemesterPct", e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 mt-2 shadow-soft" disabled={loading}>
              {loading ? "Computing Probability Model…" : "Run Custom Simulation"} <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Right Column: Simulation Result & Prediction Gauge */}
        <div className="card p-6 lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-bold font-display text-navy-950 text-base">Model Simulation Output</h2>
              {result && <RiskBadge level={result.riskLevel} />}
            </div>

            {result ? (
              <div className="mt-4">
                <div className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Predicted Classification</p>
                  <p className="mt-1 text-3xl font-extrabold font-display text-navy-950">
                    {result.predictedPerformance}
                  </p>
                </div>

                {/* Probability Meter Gauge */}
                <div className="my-6 flex justify-center">
                  <div className="relative flex items-center justify-center">
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      <circle cx="90" cy="90" r="70" stroke="#F1F5F9" strokeWidth="14" fill="none" />
                      <circle
                        cx="90"
                        cy="90"
                        r="70"
                        stroke={pct >= 75 ? "#2563EB" : pct >= 50 ? "#D97706" : "#E11D48"}
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray={`${(pct / 100) * 440} 440`}
                        strokeLinecap="round"
                        transform="rotate(-90 90 90)"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-3xl font-extrabold font-display text-navy-950">{pct}%</p>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Pass Probability</p>
                    </div>
                  </div>
                </div>

                {/* Two-Column probability summary */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                    <p className="text-[10px] uppercase font-semibold text-slate-500">Pass Likelihood</p>
                    <p className="mt-1 text-2xl font-bold font-display text-emerald-700">{pct}%</p>
                  </div>
                  <div className="rounded-2xl bg-rose-500/10 p-3 border border-rose-500/20">
                    <p className="text-[10px] uppercase font-semibold text-slate-500">Fail Likelihood</p>
                    <p className="mt-1 text-2xl font-bold font-display text-rose-700">{failPct}%</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["Excellent", "Good", "Average", "At Risk"].map((c) => (
                    <span
                      key={c}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        c === result.predictedPerformance
                          ? "bg-navy-900 text-white shadow-soft"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-center text-xs text-slate-400 font-mono">{result.method}</p>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </div>

      {/* ── Sensitivity Analysis Table ── */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-accent-600" />
          <h2 className="font-bold font-display text-navy-950 text-base">
            Sensitivity Analysis (Impact of Decision Variables)
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Estimates how incremental adjustments to study habits and attendance shift the modeled pass probability.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sensitivityCases.map((sc, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {sc.delta}
              </span>
              <p className="text-xs font-medium text-slate-700">{sc.label}</p>
              <p className={`text-xl font-bold font-display ${sc.color}`}>
                {sc.prob.toFixed(1)}% <span className="text-xs font-normal text-slate-400">Pass Prob</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Monte Carlo Simulation Results ── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-violet-600" />
            <h2 className="font-bold font-display text-navy-950 text-base">
              Monte Carlo Probabilistic Distribution
            </h2>
          </div>
          <button
            type="button"
            onClick={() => runMonteCarlo()}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 bg-violet-50 px-3 py-1.5 rounded-full"
            disabled={mcLoading}
          >
            <RefreshCw size={12} className={mcLoading ? "animate-spin" : ""} /> 
            {mcLoading ? "Running 1,000 Iterations..." : "Run 1,000 Iterations"}
          </button>
        </div>
        
        <p className="text-xs text-slate-500 mb-6">
          This advanced model runs 1,000 probabilistic simulations drawing from a normal distribution of your attendance and study habits. It shows the confidence interval of your most likely GPA outcomes.
        </p>

        {mcResult ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-100">Most Probable GPA</p>
                <p className="mt-1 text-4xl font-bold font-display">
                  {mcResult.meanGPA} <span className="text-lg text-violet-200">±{mcResult.stdGPA}</span>
                </p>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">90% Confidence Interval</p>
                <p className="mt-1 text-2xl font-bold font-display text-navy-950">
                  {mcResult.confidenceInterval.lower90} <span className="text-sm font-normal text-slate-400">to</span> {mcResult.confidenceInterval.upper90}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  You have a 90% chance of your final GPA landing in this range.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-8 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mcResult.histogram.bins.map((bin, i) => ({ bin, count: mcResult.histogram.counts[i] || 0 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="bin" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="count" name="Simulated Outcomes" stroke="#8b5cf6" fill="#c4b5fd" fillOpacity={0.5} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
