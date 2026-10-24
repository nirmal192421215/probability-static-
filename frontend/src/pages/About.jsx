import { 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  Cpu, 
  Database, 
  FileSpreadsheet, 
  Layers, 
  Lightbulb, 
  LineChart, 
  PieChart, 
  ShieldAlert, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap 
} from "lucide-react";
import { PageHeader } from "../components/ui";

export default function About() {
  const objectives = [
    {
      icon: FileSpreadsheet,
      title: "Academic Telemetry Analysis",
      desc: "Process multi-parameter student records including attendance, study hours, internals, and historical GPA.",
    },
    {
      icon: LineChart,
      title: "Descriptive Statistics",
      desc: "Calculate dynamic central tendency (Mean, Median, Mode) and variance dispersion (Standard Deviation, Quartiles).",
    },
    {
      icon: Brain,
      title: "Probability Distribution Models",
      desc: "Implement Conditional Probability, Bayes' Theorem, Normal CDF/PDF, and Binomial outcome calculations.",
    },
    {
      icon: Target,
      title: "Predictive Forecasting",
      desc: "Multivariate logistic mapping to forecast final GPA and categorized pass/fail confidence levels.",
    },
    {
      icon: ShieldAlert,
      title: "Early Academic Risk Detection",
      desc: "Segment cohort into Low, Medium, and High risk tiers for preemptive academic counseling.",
    },
    {
      icon: Lightbulb,
      title: "Smart Action Recommendations",
      desc: "Rule-based recommendation system delivering personalized study guidance and attendance targets.",
    },
    {
      icon: PieChart,
      title: "Interactive Visual Analytics",
      desc: "High-density charts, normal distribution curves, scatter correlation plots, and radar subject matrices.",
    },
    {
      icon: Layers,
      title: "Publication-Ready PDF Reports",
      desc: "Generate complete downloadable student dossiers formatted for faculty evaluation and viva presentation.",
    },
  ];

  const models = [
    {
      name: "Conditional Probability",
      formula: "P(A | B) = P(A ∩ B) / P(B)",
      useCase: "Evaluates the likelihood of high performance (GPA ≥ 6.5) given attendance exceeding the 75% threshold.",
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "Bayes' Theorem",
      formula: "P(Risk | Factors) = [P(Factors | Risk) · P(Risk)] / P(Factors)",
      useCase: "Combines prior probability with evidence (low attendance & study hours) to calculate posterior risk probability.",
      color: "from-indigo-600 to-purple-600",
    },
    {
      name: "Normal (Gaussian) Distribution",
      formula: "Z = (X - μ) / σ  ;  P(X > t) = 1 - Φ(Z)",
      useCase: "Calculates standard Z-scores and exact probabilities of scoring above or below target cutoff marks.",
      color: "from-cyan-600 to-blue-600",
    },
    {
      name: "Binomial Distribution",
      formula: "P(X = k) = C(n, k) · p^k · (1 - p)^(n - k)",
      useCase: "Models discrete subject pass counts across n scheduled semester exams with fixed individual pass probability p.",
      color: "from-emerald-600 to-teal-600",
    },
  ];

  const techStack = [
    { category: "Frontend", items: ["React 18", "Vite", "Tailwind CSS", "Recharts", "Lucide Icons", "React Router v7"] },
    { category: "Backend & API", items: ["Python FastAPI", "Uvicorn", "Pydantic v2", "Jose JWT Auth", "Bcrypt"] },
    { category: "Statistical Engine", items: ["Python Math Library", "NumPy", "Pandas", "Statistical Engine Engine"] },
    { category: "Persistence & Docs", items: ["MongoDB", "Motor Async Driver", "ReportLab PDF Engine"] },
  ];

  return (
    <div className="space-y-8 animate-fade-up max-w-6xl">
      <PageHeader 
        title="About Capstone Project" 
        subtitle="Mathematical Foundations, Probability Models & System Architecture"
      />

      {/* ── Hero Title Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-accent-600 p-8 text-white shadow-2xl">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/20 mb-4">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Probability &amp; Statistics Academic Capstone</span>
          </div>
          
          <h1 className="text-2xl font-bold font-display sm:text-3xl lg:text-4xl text-white leading-tight">
            Statistical Analysis &amp; Prediction of Student Academic Performance Using Probability Models
          </h1>
          
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            An end-to-end educational intelligence system that transforms raw institutional data into probability-grounded insights, early risk detection matrix, and actionable coaching recommendations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🎓 Capstone Viva Edition
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              📊 4 Probability Modules
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              ⚡ Zero Hardcoding (Live Engine)
            </span>
          </div>
        </div>
      </div>

      {/* ── Problem Statement vs Proposed Solution ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6 border-l-4 border-l-rose-500 relative">
          <div className="flex items-center gap-2 text-rose-600 font-display font-bold text-lg mb-3">
            <ShieldAlert size={20} />
            <h2>Problem Statement</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Educational institutions collect large amounts of academic data across semesters (attendance logs, internal tests, assignments, GPA history), but this data often remains stagnant in traditional spreadsheets.
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Without automated probability modeling, educators struggle to detect at-risk students until final semester results are published—preventing timely pedagogical intervention.
          </p>
        </div>

        <div className="card p-6 border-l-4 border-l-emerald-500 relative">
          <div className="flex items-center gap-2 text-emerald-600 font-display font-bold text-lg mb-3">
            <Zap size={20} />
            <h2>Proposed Solution</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            This platform bridges classroom data and applied statistical mathematics. By implementing continuous probability distributions, Bayes' inference, and weighted logistic estimators, it calculates live pass probabilities.
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            It delivers personalized coaching recommendations and publication-grade PDF dossiers for faculty reviews, student counseling, and academic accreditation.
          </p>
        </div>
      </div>

      {/* ── Core Project Identity Quote ── */}
      <div className="rounded-2xl border border-accent-500/30 bg-accent-500/5 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-600">Core Identity</p>
        <blockquote className="mt-2 text-lg font-bold font-display text-navy-950 sm:text-xl italic">
          "Transform academic data into statistical insights, probability-based predictions, and actionable student performance recommendations."
        </blockquote>
      </div>

      {/* ── Mathematical Models & Formula Cheat Sheet ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
          <h2 className="text-xl font-bold font-display text-navy-950">
            Probability Models &amp; Mathematical Formulations
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {models.map((m) => (
            <div key={m.name} className="card p-6 relative overflow-hidden group">
              <div className={`h-1.5 w-full bg-gradient-to-r ${m.color} absolute top-0 left-0 right-0`} />
              <h3 className="font-bold text-navy-950 font-display text-lg mt-1">{m.name}</h3>
              
              {/* Formula Callout */}
              <div className="my-3 rounded-xl bg-slate-900 px-4 py-2.5 font-mono text-xs text-cyan-300 tracking-wide">
                {m.formula}
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">{m.useCase}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Project Objectives Matrix ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
          <h2 className="text-xl font-bold font-display text-navy-950">
            Key Objectives &amp; System Deliverables
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {objectives.map((obj, i) => (
            <div key={obj.title} className="card-interactive p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/10 text-accent-600">
                  <obj.icon size={20} />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400">0{i + 1}</span>
              </div>
              <h3 className="font-bold text-navy-950 text-sm font-display">{obj.title}</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Full Stack Architecture & Tech Badges ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-xl font-bold font-display text-navy-950">
            Technology Stack &amp; Architecture
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((stack) => (
            <div key={stack.category} className="card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                {stack.category}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {stack.items.map((tech) => (
                  <span 
                    key={tech} 
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-navy-900"
                  >
                    <CheckCircle2 size={12} className="text-accent-600" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Viva / Faculty Evaluation Summary Box ── */}
      <div className="card-dark p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-400 border border-white/15 shadow-glow">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Academic Submission &amp; Viva Presentation Ready
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              All probability equations are dynamically computed on live MongoDB documents through pure mathematical algorithms. There is no mocked or static data. All models update in real time when new student records are inserted, modified, or deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
