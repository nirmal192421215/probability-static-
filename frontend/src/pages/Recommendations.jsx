import { useEffect, useState } from "react";
import { api } from "../api";
import { EmptyState, PageHeader, RiskBadge, Spinner } from "../components/ui";

export default function Recommendations() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(studentId = "") {
    setLoading(true);
    const path = studentId ? `/api/recommendations?studentId=${studentId}` : "/api/recommendations";
    const data = await api(path);
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    api("/api/students").then(setStudents);
    load();
  }, []);

  return (
    <div>
      <PageHeader title="Actionable Recommendation Engine" subtitle="Rule-based probabilistic guidance tailored to attendance, study pace, and curriculum weak points" />
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <select
          className="input max-w-sm"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            load(e.target.value);
          }}
        >
          <option value="">All Students (Cohort Overview)</option>
          {students.map((s) => (
            <option key={s.studentId} value={s.studentId}>
              {s.studentId} — {s.name}
            </option>
          ))}
        </select>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          Showing {rows.length} Action Items
        </span>
      </div>
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No recommendations" text="No matching guidance for the current filter." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r, i) => (
            <div key={i} className="card p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-950 text-base">{r.issue}</h3>
                    <p className="mt-0.5 text-xs text-slate-400 font-mono">
                      {r.studentId} · {r.name}
                    </p>
                  </div>
                  <RiskBadge level={r.priority} />
                </div>
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <b className="text-navy-950 font-semibold">Evidence:</b> {r.evidence}
                </div>
              </div>
              <div className="mt-3 p-3.5 rounded-xl bg-accent-50/60 border border-accent-100 text-xs text-slate-800 font-medium leading-relaxed">
                💡 {r.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
