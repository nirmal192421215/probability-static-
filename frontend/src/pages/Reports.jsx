import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api";
import { ChartCard, PageHeader, RiskBadge, Spinner } from "../components/ui";
import { useToast } from "../context/ToastContext";

export default function Reports() {
  const { push } = useToast();
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/api/students").then((rows) => {
      setStudents(rows);
      if (rows[0]) setId(rows[0].studentId);
    });
  }, []);

  async function generate() {
    setLoading(true);
    try {
      setReport(await api(`/api/reports/${id}`));
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function download() {
    try {
      const blob = await api(`/api/reports/${id}/pdf`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EduWise_${id}_Report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      push(e.message, "error");
    }
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Academic-submission style student intelligence report"
        actions={
          <>
            <button className="btn-secondary no-print" onClick={generate} disabled={!id}>
              Generate Report
            </button>
            <button className="btn-secondary no-print" onClick={download} disabled={!id}>
              Download PDF
            </button>
            <button className="btn-primary no-print" onClick={() => window.print()} disabled={!report}>
              Print Report
            </button>
          </>
        }
      />
      <select className="input no-print mb-4 max-w-sm" value={id} onChange={(e) => setId(e.target.value)}>
        {students.map((s) => (
          <option key={s.studentId} value={s.studentId}>
            {s.studentId} — {s.name}
          </option>
        ))}
      </select>
      {loading && <Spinner />}
      {report && (
        <article className="print-area card p-8 border border-slate-200/80 shadow-soft max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-accent-700 border border-blue-100 mb-2">
                Official Intelligence Report
              </div>
              <h2 className="text-2xl font-bold font-display text-navy-950">EduWise Academic Report</h2>
              <p className="text-xs text-slate-500 mt-1">Statistical Analysis and Prediction of Student Academic Performance</p>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              ID: {report.student.studentId}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Student Profile</p>
              <p className="mt-1 font-bold text-navy-950 text-base">{report.student.name}</p>
              <p className="text-xs text-slate-500">{report.student.department} · Semester {report.student.semester}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase text-slate-400">Predicted Classification</p>
              <div className="mt-1 flex sm:justify-end items-center gap-2">
                <span className="font-bold text-navy-950">{report.prediction.predictedPerformance}</span>
                <RiskBadge level={report.prediction.riskLevel} />
              </div>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Pass Prob: {report.prediction.passProbability}%</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <h3 className="font-bold text-navy-950 text-sm mb-2">Cohort Statistical Baseline</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cohort mean <b>{report.stats.mean}%</b>, median <b>{report.stats.median}%</b>, standard deviation <b>±{report.stats.standardDeviation}</b>.
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-slate-100 bg-white">
              <h3 className="font-bold text-navy-950 text-sm mb-2">Multivariate Probability Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{report.conditional.interpretation}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Bayes posterior P(At Risk | factors) = {report.bayes.posterior}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-navy-950 text-sm mb-3">Subject Performance Matrix</h3>
            <div className="h-60 rounded-2xl border border-slate-100 p-2 bg-slate-50/50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(report.student.subjectMarks || {}).map(([subject, marks]) => ({ subject, marks }))}
                  margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="marks" name="Marks %" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-navy-950 text-sm mb-3">Targeted Interventions & Recommendations</h3>
            <div className="space-y-2.5">
              {report.recommendations.map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-navy-950">{r.issue}:</span> <span className="text-slate-700">{r.recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
