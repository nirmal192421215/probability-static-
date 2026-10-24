import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { api } from "../api";
import { EmptyState, PageHeader, RiskBadge, Spinner } from "../components/ui";

const COLORS = { LOW: "#059669", MEDIUM: "#D97706", HIGH: "#E11D48" };

export default function Risk() {
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/api/risk")
      .then(setData)
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-rose-600">{err}</p>;
  if (!data) return <Spinner />;

  const atRisk = data.students.filter((s) => s.riskLevel !== "LOW");

  return (
    <div>
      <PageHeader title="Risk Analysis" subtitle="LOW ≥ 80% pass probability · MEDIUM 50–79% · HIGH < 50%" />
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        <div className="card p-6 border border-slate-200/80 shadow-soft lg:col-span-6 flex flex-col justify-between">
          <h3 className="font-bold text-navy-950 font-display text-base">Risk Distribution Breakdown</h3>
          <div className="h-64 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.distribution} dataKey="count" nameKey="level" innerRadius={65} outerRadius={95} paddingAngle={4}>
                  {data.distribution.map((d) => (
                    <Cell key={d.level} fill={COLORS[d.level]} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between gap-3">
          {data.distribution.map((d) => (
            <div key={d.level} className="card flex items-center justify-between p-5 border border-slate-200/80 shadow-soft flex-1">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${d.level === "LOW" ? "bg-emerald-500" : d.level === "MEDIUM" ? "bg-amber-500" : "bg-rose-500"}`} />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{d.level} RISK TIER</p>
                </div>
                <p className="text-3xl font-extrabold font-display text-navy-950 mt-1">{d.percent}%</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 font-mono">
                  {d.count} Students
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-bold font-display text-navy-950">At-Risk Student Registry</h3>
        {atRisk.length === 0 ? (
          <EmptyState title="No medium or high-risk students" text="Every modelled pass probability is currently 80% or higher." />
        ) : (
          <div className="card overflow-hidden border border-slate-200/80 shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm divide-y divide-slate-200">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5 text-left">Student ID</th>
                    <th className="px-4 py-3.5 text-left">Name</th>
                    <th className="px-4 py-3.5 text-center">Attendance</th>
                    <th className="px-4 py-3.5 text-center">GPA</th>
                    <th className="px-4 py-3.5 text-center">Pass Prob</th>
                    <th className="px-4 py-3.5 text-center">Risk Level</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {atRisk.map((s) => (
                    <tr key={s.studentId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-navy-950 font-mono">{s.studentId}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">{s.name}</td>
                      <td className="px-4 py-3.5 text-center font-mono">{s.attendance}%</td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-navy-950">{s.currentGPA}</td>
                      <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-700">{s.passProbability}%</td>
                      <td className="px-4 py-3.5 text-center">
                        <RiskBadge level={s.riskLevel} />
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button 
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          onClick={() => nav(`/app/students/${s.studentId}`)}
                        >
                          Intervene
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
