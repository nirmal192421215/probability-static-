import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";
import { ChartCard, EmptyState, PageHeader, Spinner, StatCard } from "../components/ui";
import { useToast } from "../context/ToastContext";

export default function Statistics() {
  const { push } = useToast();
  const [filters, setFilters] = useState({ dataset: "all", subject: "", semester: "", parameter: "averageMarks" });
  const [stats, setStats] = useState(null);
  const [corr, setCorr] = useState([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const body = {
        ...filters,
        semester: filters.semester ? Number(filters.semester) : null,
        subject: filters.subject || null,
      };
      const [d, c] = await Promise.all([
        api("/api/analysis/descriptive", { method: "POST", body }),
        api("/api/analysis/correlation", { method: "POST", body: { pair: "all" } }),
      ]);
      setStats(d);
      setCorr(c.pairs);
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
  }, []);

  return (
    <div>
      <PageHeader title="Statistical Analysis" subtitle="Descriptive statistics and Pearson correlation from the live dataset" />
      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <select className="input" value={filters.dataset} onChange={(e) => setFilters({ ...filters, dataset: e.target.value })}>
          <option value="all">All students</option>
          <option value="high_performers">High performers</option>
          <option value="at_risk">At risk</option>
        </select>
        <select className="input" value={filters.parameter} onChange={(e) => setFilters({ ...filters, parameter: e.target.value })}>
          <option value="averageMarks">Average marks</option>
          <option value="attendance">Attendance</option>
          <option value="studyHours">Study hours</option>
          <option value="currentGPA">Current GPA</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Statistics">Statistics</option>
          <option value="Computer Science">Computer Science</option>
          <option value="English">English</option>
        </select>
        <select className="input" value={filters.semester} onChange={(e) => setFilters({ ...filters, semester: e.target.value })}>
          <option value="">All semesters</option>
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>
        <button className="btn-primary" onClick={run}>
          Calculate
        </button>
      </div>
      {loading && <Spinner />}
      {!loading && stats && stats.count === 0 && (
        <EmptyState title="No statistics" text="No records match the selected dataset, subject, or semester." />
      )}
      {stats && stats.count > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Mean" value={stats.mean} />
            <StatCard label="Median" value={stats.median} />
            <StatCard label="Mode" value={stats.mode} />
            <StatCard label="Variance" value={stats.variance} />
            <StatCard label="Std. Deviation" value={stats.standardDeviation} />
            <StatCard label="Minimum" value={stats.minimum} />
            <StatCard label="Maximum" value={stats.maximum} />
            <StatCard label="Range" value={stats.range} />
            <StatCard label="Q1 (25th %)" value={stats.q1} />
            <StatCard label="Q2 (Median)" value={stats.q2} />
            <StatCard label="Q3 (75th %)" value={stats.q3} />
            <StatCard label="Sample Size (n)" value={stats.count} />
          </div>
          <p className="mt-3 text-xs text-slate-400 font-mono">{stats.formulaNote}</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ChartCard title="Frequency Histogram">
              <ResponsiveContainer>
                <BarChart data={stats.histogram.bins.map((b, i) => ({ bin: b, count: stats.histogram.counts[i] }))} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="bin" tick={{ fontSize: 12, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="count" name="Frequency" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Percentage Distribution">
              <ResponsiveContainer>
                <BarChart data={stats.distribution} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis unit="%" tick={{ fontSize: 12, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="percent" name="Cohort %" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold font-display text-navy-950">Pearson Correlation Analysis</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {corr.map((c) => {
            const isPos = c.coefficient >= 0;
            const isStrong = Math.abs(c.coefficient) >= 0.6;
            return (
              <div key={c.pair} className="card p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{c.pair}</h3>
                    <p className="mt-1 text-xs text-slate-500">{c.interpretation}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                    isStrong ? (isPos ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200") : "bg-slate-100 text-slate-700"
                  }`}>
                    r = {c.coefficient}
                  </span>
                </div>
                <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${isPos ? "bg-blue-600" : "bg-rose-500"}`} 
                    style={{ width: `${Math.abs(c.coefficient) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
