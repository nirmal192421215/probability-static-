import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";
import { PageHeader, StatCard } from "../components/ui";
import { useToast } from "../context/ToastContext";

export default function Probability() {
  const { push } = useToast();
  const [cond, setCond] = useState(null);
  const [bayes, setBayes] = useState(null);
  const [bayesIn, setBayesIn] = useState({ attendanceThreshold: 75, studyHoursThreshold: 3 });
  const [normal, setNormal] = useState(null);
  const [target, setTarget] = useState(80);
  const [param, setParam] = useState("averageMarks");
  const [bin, setBin] = useState({ n: 5, p: 0.7, k: 4, result: null });

  async function loadCond() {
    try {
      setCond(await api("/api/probability/conditional", { method: "POST", body: {} }));
    } catch (e) {
      push(e.message, "error");
    }
  }
  async function loadBayes() {
    try {
      setBayes(await api("/api/probability/bayes", { method: "POST", body: bayesIn }));
    } catch (e) {
      push(e.message, "error");
    }
  }
  async function loadNormal() {
    try {
      setNormal(await api("/api/probability/normal", { method: "POST", body: { parameter: param, targetScore: Number(target) } }));
    } catch (e) {
      push(e.message, "error");
    }
  }
  async function loadBin() {
    try {
      const result = await api("/api/probability/binomial", { method: "POST", body: { n: +bin.n, p: +bin.p, k: +bin.k } });
      setBin((b) => ({ ...b, result }));
    } catch (e) {
      push(e.message, "error");
    }
  }

  useEffect(() => {
    loadCond();
    loadBayes();
    loadNormal();
    loadBin();
  }, []);

  return (
    <div>
      <PageHeader title="Probability Analysis" subtitle="Conditional probability, Bayes’ theorem, normal and binomial models" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-navy-950 font-display text-base">Conditional Probability Model</h3>
            <p className="mt-1 text-xs text-slate-500">P(High Performance | High Attendance ≥ 75%)</p>
            {cond && (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase font-semibold text-blue-600">Calculated P(A|B)</p>
                    <p className="mt-1 text-3xl font-extrabold text-navy-950 font-display">{cond.percent}%</p>
                  </div>
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-800">
                    p = {cond.probability}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{cond.interpretation}</p>
                <div className="text-xs font-mono text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                  {cond.formula} · n = {cond.n}, both = {cond.nBoth}
                </div>
              </div>
            )}
          </div>
          <button className="btn-secondary mt-6 w-full" onClick={loadCond}>
            Recalculate Probability
          </button>
        </div>

        <div className="card p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-navy-950 font-display text-base">Bayes' Theorem Classifier</h3>
            <p className="mt-1 text-xs text-slate-500">P(At Risk | Academic Risk Factors)</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500">Attendance Thresh (%)</label>
                <input className="input mt-1" type="number" value={bayesIn.attendanceThreshold} onChange={(e) => setBayesIn({ ...bayesIn, attendanceThreshold: +e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Study Hours Thresh (h)</label>
                <input className="input mt-1" type="number" value={bayesIn.studyHoursThreshold} onChange={(e) => setBayesIn({ ...bayesIn, studyHoursThreshold: +e.target.value })} />
              </div>
            </div>
            {bayes && (
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <StatCard label="Prior P(A)" value={bayes.prior} />
                <StatCard label="Likelihood P(B|A)" value={bayes.likelihood} />
                <StatCard label="Evidence P(B)" value={bayes.evidence} />
                <StatCard label="Posterior P(A|B)" value={`${bayes.posteriorPercent}%`} />
                <p className="col-span-2 text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-1">
                  {bayes.formula}
                </p>
              </div>
            )}
          </div>
          <button className="btn-secondary mt-6 w-full" onClick={loadBayes}>
            Update Bayes Model
          </button>
        </div>

        <div className="card p-6 border border-slate-200/80 shadow-soft lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-bold text-navy-950 font-display text-base">Normal Distribution Analysis (Gaussian Model)</h3>
              <p className="mt-1 text-xs text-slate-500">Z-score computation and cumulative probability curve Φ(Z)</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select className="input text-xs" value={param} onChange={(e) => setParam(e.target.value)}>
                <option value="averageMarks">Average Marks</option>
                <option value="attendance">Attendance</option>
                <option value="currentGPA">Current GPA</option>
              </select>
              <input className="input w-24 text-xs" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
              <button className="btn-primary text-xs" onClick={loadNormal}>
                Compute
              </button>
            </div>
          </div>

          {normal && !normal.error && (
            <div className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Mean (μ)" value={normal.mean} />
                <StatCard label="Std. Deviation (σ)" value={normal.standardDeviation} />
                <StatCard label="Computed Z-Score" value={normal.zScore} />
                <StatCard label="P(Score > Target)" value={`${normal.probabilityAbove}%`} />
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <span className="text-slate-600">
                  Target Score: <b className="text-navy-950 font-mono">{normal.targetScore}</b> · Probability below target: <b className="text-navy-950 font-mono">{normal.probabilityBelow}%</b>
                </span>
                <span className="font-mono text-slate-400">{normal.formula}</span>
              </div>

              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={normal.curve.x.map((x, i) => ({ x, y: normal.curve.y[i] }))} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="x" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                    <Area type="monotone" dataKey="y" name="Probability Density" stroke="#2563EB" fill="#93C5FD" fillOpacity={0.5} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="card p-6 border border-slate-200/80 shadow-soft lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-bold text-navy-950 font-display text-base">Binomial Probability Model</h3>
              <p className="mt-1 text-xs text-slate-500">P(X = k) for independent subject pass outcomes</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">n:</span>
                <input className="input w-16 text-xs" type="number" value={bin.n} onChange={(e) => setBin({ ...bin, n: e.target.value })} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">p:</span>
                <input className="input w-20 text-xs" type="number" step="0.01" value={bin.p} onChange={(e) => setBin({ ...bin, p: e.target.value })} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500">k:</span>
                <input className="input w-16 text-xs" type="number" value={bin.k} onChange={(e) => setBin({ ...bin, k: e.target.value })} />
              </div>
              <button className="btn-primary text-xs" onClick={loadBin}>
                Calculate
              </button>
            </div>
          </div>

          {bin.result && (
            <div className="mt-6">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <span className="text-slate-800 font-medium">{bin.result.interpretation}</span>
                <span className="font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                  P(X ≥ {bin.k}) = {bin.result.probabilityAtLeast}
                </span>
              </div>

              <div className="mt-6 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bin.result.chart.x.map((x, i) => ({ k: `k=${x}`, p: bin.result.chart.y[i] }))} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="k" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="p" name="P(X=k)" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
