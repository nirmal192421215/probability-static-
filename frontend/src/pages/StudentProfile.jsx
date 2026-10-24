import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../api";
import { PageHeader, RiskBadge, Spinner, StatCard } from "../components/ui";

export default function StudentProfile() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api(`/api/students/${id}`)
      .then(setS)
      .catch((e) => setErr(e.message));
  }, [id]);

  if (err) return <p className="text-rose-600">{err}</p>;
  if (!s) return <Spinner />;

  const radar = Object.entries(s.subjectMarks || {}).map(([subject, value]) => ({ subject, value }));

  return (
    <div>
      <PageHeader title={s.name} subtitle={`${s.studentId} · ${s.department} · Semester ${s.semester}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current GPA" value={s.currentGPA} />
        <StatCard label="Attendance" value={`${s.attendance}%`} />
        <StatCard label="Average Marks" value={`${s.averageMarks}%`} />
        <StatCard label="Study Hours" value={`${s.studyHours}h/day`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6 border border-slate-200/80 shadow-soft">
          <h3 className="font-bold text-navy-950 font-display text-base mb-4">Statistical Performance Profile</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Mean (μ)</p>
              <p className="mt-1 text-lg font-bold font-display text-navy-950">{s.statisticalSummary?.mean}%</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Median</p>
              <p className="mt-1 text-lg font-bold font-display text-navy-950">{s.statisticalSummary?.median}%</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Std. Deviation (σ)</p>
              <p className="mt-1 text-lg font-bold font-display text-navy-950">±{s.statisticalSummary?.standardDeviation}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 font-medium">Cohort Percentile</p>
              <p className="mt-1 text-lg font-bold font-display text-emerald-600">{s.statisticalSummary?.percentile}th</p>
            </div>
          </div>
        </div>

        <div className="card p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <h3 className="font-bold text-navy-950 font-display text-base mb-4">Probability & Risk Classification</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <p className="text-xs font-semibold text-emerald-700 uppercase">Pass Probability</p>
              <p className="mt-1 text-2xl font-bold font-display text-emerald-950">{s.prediction?.passProbability}%</p>
            </div>
            <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl">
              <p className="text-xs font-semibold text-rose-700 uppercase">Fail Probability</p>
              <p className="mt-1 text-2xl font-bold font-display text-rose-950">{s.prediction?.failProbability}%</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
            <span className="text-slate-600 font-medium">Risk Level: <RiskBadge level={s.prediction?.riskLevel} /></span>
            <span className="text-slate-600 font-medium">Academic Status: <RiskBadge level={s.status} /></span>
          </div>
        </div>
      </div>

      <div className="card mt-6 p-6 border border-slate-200/80 shadow-soft">
        <h3 className="font-bold text-navy-950 font-display text-base mb-2">Subject Performance Radar</h3>
        <p className="text-xs text-slate-500 mb-4">Multivariate subject balance matrix</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#475569" }} />
              <PolarRadiusAxis domain={[0, 100]} stroke="#CBD5E1" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
              <Radar dataKey="value" name="Subject Score" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-bold font-display text-navy-950">Actionable Interventions</h3>
        <div className="grid gap-3">
          {s.recommendations?.map((r, i) => (
            <div key={i} className="card p-5 border border-slate-200/80 shadow-soft">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-navy-950 text-sm">{r.issue}</h4>
                <RiskBadge level={r.priority} />
              </div>
              <p className="mt-2 text-xs text-slate-500"><b>Evidence:</b> {r.evidence}</p>
              <p className="mt-2 text-xs text-slate-800 bg-accent-50/50 p-3 rounded-xl border border-accent-100 font-medium">
                💡 {r.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
