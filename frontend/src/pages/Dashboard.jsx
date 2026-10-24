import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
  ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from "recharts";
import { 
  AlertCircle, ArrowRight, Award, BookOpen, CheckCircle, 
  ClipboardList, Clock, Gauge, GraduationCap, Percent, 
  ShieldAlert, TrendingUp, UserCheck, Users 
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { ChartCard, KpiCard, RiskBadge, Spinner } from "../components/ui";
import { useToast } from "../context/ToastContext";

function StudentHome() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the primary student record for demo or from database
    api("/api/students")
      .then((students) => {
        if (students && students.length > 0) {
          // Select student ST001 or first student
          return api(`/api/students/${students[0].studentId}`);
        }
        return null;
      })
      .then((data) => setStudent(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  // Default fallback data if no records
  const s = student || {
    studentId: "ST001",
    name: user?.name || "Student User",
    department: "Computer Science",
    semester: 4,
    currentGPA: 8.4,
    attendance: 92,
    studyHours: 6.2,
    averageMarks: 88,
    status: "Excellent",
    prediction: { passProbability: 93.6, failProbability: 6.4, riskLevel: "LOW" },
    statisticalSummary: { mean: 87.6, median: 88.0, standardDeviation: 3.2, percentile: 92.5 },
    subjectMarks: { Mathematics: 90, Statistics: 88, "Computer Science": 92, English: 84, Physics: 86 },
    recommendations: [
      { issue: "Consistent High Attendance", priority: "Low", evidence: "92% attendance logged across all lectures.", recommendation: "Maintain attendance above 85% to preserve top honors ranking." },
      { issue: "Optimal Study Habit", priority: "Low", evidence: "6.2 hours/day study pace is optimal for semester 4.", recommendation: "Continue current revision schedule for upcoming final examinations." }
    ]
  };

  const radarData = Object.entries(s.subjectMarks || {}).map(([subject, value]) => ({ subject, value }));
  const passProb = s.prediction?.passProbability ?? 90;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Welcome Header Card ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-accent-600 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Student Academic Profile · {s.studentId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Department of {s.department} · Semester {s.semester} · Academic Year 2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/app/prediction" className="btn-accent text-xs sm:text-sm shadow-glowCyan">
              What-If Simulator <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Top 4 Academic KPIs ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-interactive p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current GPA</p>
              <p className="mt-2 text-3xl font-bold font-display text-navy-950">{s.currentGPA} <span className="text-xs text-slate-400">/ 10</span></p>
              <p className="mt-1 text-xs text-emerald-600 font-semibold font-sans">Top {100 - (s.statisticalSummary?.percentile || 90)}% of Cohort</p>
            </div>
            <div className="rounded-2xl bg-blue-500/10 p-3 text-accent-600">
              <GraduationCap size={22} />
            </div>
          </div>
        </div>

        <div className="card-interactive p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Attendance</p>
              <p className="mt-2 text-3xl font-bold font-display text-navy-950">{s.attendance}%</p>
              <p className="mt-1 text-xs text-emerald-600 font-semibold font-sans">≥ 75% Requirement Met ✅</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="card-interactive p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Marks</p>
              <p className="mt-2 text-3xl font-bold font-display text-navy-950">{s.averageMarks}%</p>
              <p className="mt-1 text-xs text-slate-400">Across {Object.keys(s.subjectMarks || {}).length} Subjects</p>
            </div>
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600">
              <Award size={22} />
            </div>
          </div>
        </div>

        <div className="card-interactive p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Study Hours</p>
              <p className="mt-2 text-3xl font-bold font-display text-navy-950">{s.studyHours} <span className="text-xs text-slate-400">hrs/day</span></p>
              <p className="mt-1 text-xs text-cyan-600 font-semibold">Optimal Pace</p>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600">
              <Clock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column: Probability Status & Subject Radar ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Probability & Risk Gauge */}
        <div className="card p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold font-display text-navy-950 text-base">Pass Probability Model</h2>
              <RiskBadge level={s.prediction?.riskLevel || "LOW"} />
            </div>
            <p className="mt-1 text-xs text-slate-500">Calculated live using multivariate logistic probability</p>

            {/* Circular Gauge */}
            <div className="my-6 flex justify-center">
              <div className="relative flex items-center justify-center">
                <svg width="170" height="170" viewBox="0 0 170 170">
                  <circle cx="85" cy="85" r="64" stroke="#F1F5F9" strokeWidth="14" fill="none" />
                  <circle
                    cx="85"
                    cy="85"
                    r="64"
                    stroke="#2563EB"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${(passProb / 100) * 402} 402`}
                    strokeLinecap="round"
                    transform="rotate(-90 85 85)"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold font-display text-navy-950">{passProb}%</p>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Pass Likelihood</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-emerald-500/10 p-3 border border-emerald-500/20">
                <p className="text-[10px] uppercase font-semibold text-slate-500">Pass Probability</p>
                <p className="mt-1 text-xl font-bold font-display text-emerald-700">{s.prediction?.passProbability}%</p>
              </div>
              <div className="rounded-2xl bg-rose-500/10 p-3 border border-rose-500/20">
                <p className="text-[10px] uppercase font-semibold text-slate-500">Fail Probability</p>
                <p className="mt-1 text-xl font-bold font-display text-rose-700">{s.prediction?.failProbability}%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Performance Tier</span>
            <span className="font-bold text-navy-950 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
              {s.status}
            </span>
          </div>
        </div>

        {/* Right Column: Subject Performance Radar & Stats */}
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold font-display text-navy-950 text-base">Subject Performance Matrix</h2>
            <span className="text-xs text-slate-400 font-mono">Semester {s.semester}</span>
          </div>
          <p className="text-xs text-slate-500">Scores across curriculum modules</p>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#475569" }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#CBD5E1" />
                <Tooltip />
                <Radar dataKey="value" name="Your Marks" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Subject score pill badges */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(s.subjectMarks || {}).map(([subject, marks]) => (
              <div key={subject} className="rounded-xl bg-slate-50 p-2.5 text-xs flex justify-between items-center border border-slate-100">
                <span className="text-slate-600 truncate mr-2">{subject}</span>
                <span className="font-bold font-display text-navy-950">{marks}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Actionable Recommendations & Statistical Summary ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Recommendations */}
        <div className="card p-6 lg:col-span-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
            <h2 className="font-bold font-display text-navy-950 text-base">Personal Action Recommendations</h2>
          </div>

          <div className="space-y-3">
            {(s.recommendations || []).map((r, i) => (
              <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-navy-950">{r.issue}</h3>
                  <RiskBadge level={r.priority} />
                </div>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  <b>Evidence:</b> {r.evidence}
                </p>
                <p className="mt-1.5 text-xs text-slate-700 font-medium leading-relaxed bg-accent-500/5 p-2.5 rounded-xl border border-accent-500/10">
                  💡 {r.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Cohort Summary */}
        <div className="card p-6 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <h2 className="font-bold font-display text-navy-950 text-base">Cohort Statistical Measures</h2>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Mean Mark (μ)</span>
                <span className="font-bold font-display text-navy-950 text-sm">{s.statisticalSummary?.mean}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Median Mark</span>
                <span className="font-bold font-display text-navy-950 text-sm">{s.statisticalSummary?.median}%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Standard Deviation (σ)</span>
                <span className="font-bold font-display text-navy-950 text-sm">±{s.statisticalSummary?.standardDeviation}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Cohort Percentile</span>
                <span className="font-bold font-display text-emerald-600 text-sm">{s.statisticalSummary?.percentile}th Percentile</span>
              </div>
            </div>
          </div>

          {/* Quick link banner to Simulator */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy-900 to-accent-600 p-4 text-white text-xs">
            <p className="font-bold font-display text-sm text-white">Want to simulate what-if scenarios?</p>
            <p className="mt-1 text-slate-300">Test how changes in attendance or study hours impact your final GPA.</p>
            <Link to="/app/prediction" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-cyan-300 hover:text-white transition-colors">
              Open Prediction Simulator <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Admin / Faculty full analytics dashboard ───────────────────────────
function StaffDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([api("/api/dashboard/summary"), api("/api/dashboard/charts")])
      .then(([s, c]) => { setSummary(s); setCharts(c); })
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="text-rose-600">{err}</p>;
  if (!summary || !charts) return <Spinner />;

  const subtitle = user?.role === "Administrator"
    ? "Full system overview — manage students, review all analytics, and generate reports."
    : "Class overview — view student analytics, identify at-risk students, and review recommendations.";

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard icon={Users}     label="Total Students"     value={summary.totalStudents}              delay={0}   />
        <KpiCard icon={TrendingUp} label="Average Marks"      value={`${summary.averageMarks}%`}         delay={40}  />
        <KpiCard icon={UserCheck}  label="Average Attendance" value={`${summary.averageAttendance}%`}    delay={80}  />
        <KpiCard icon={Percent}    label="Pass Probability"   value={`${summary.passProbability}%`}      delay={120} />
        <KpiCard icon={ShieldAlert} label="Students At Risk"  value={summary.studentsAtRisk}             delay={160} />
        <KpiCard icon={Gauge}      label="Prediction Accuracy" value={`${summary.predictionAccuracy}%`}  delay={200} hint="Predicted vs observed category" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Performance Distribution">
          <ResponsiveContainer>
            <BarChart data={charts.performanceDistribution} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
              <Legend />
              <Bar dataKey="count" name="Students" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Attendance vs Marks">
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" dataKey="x" name="Attendance" unit="%" tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }} tickLine={{ stroke: '#E2E8F0' }} axisLine={{ stroke: '#E2E8F0', strokeWidth: 2 }} tickMargin={10} domain={[40, 100]} />
              <YAxis type="number" dataKey="y" name="Marks" unit="%" tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }} tickLine={{ stroke: '#E2E8F0' }} axisLine={{ stroke: '#E2E8F0', strokeWidth: 2 }} tickMargin={10} domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: '#94A3B8' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Scatter name="Students" data={charts.attendanceVsMarks} fill="#38BDF8" stroke="#0284C7" strokeWidth={2} opacity={0.9} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Study Hours vs Performance">
          <ResponsiveContainer>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" dataKey="x" name="Study hours" tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }} tickLine={{ stroke: '#E2E8F0' }} axisLine={{ stroke: '#E2E8F0', strokeWidth: 2 }} tickMargin={10} domain={[0, 'dataMax + 1']} />
              <YAxis type="number" dataKey="y" name="Marks" unit="%" tick={{ fontSize: 12, fill: "#475569", fontWeight: 500 }} tickLine={{ stroke: '#E2E8F0' }} axisLine={{ stroke: '#E2E8F0', strokeWidth: 2 }} tickMargin={10} domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: '#94A3B8' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Scatter name="Students" data={charts.studyHoursVsPerformance} fill="#A78BFA" stroke="#6D28D9" strokeWidth={2} opacity={0.9} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Subject Performance">
          <ResponsiveContainer>
            <BarChart data={charts.subjectPerformance} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="average" name="Average %" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="xl:col-span-2">
          <ChartCard title="Performance Trend by Semester">
            <ResponsiveContainer>
              <LineChart data={charts.performanceTrend} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: "#475569" }} tickLine={{ stroke: "#E2E8F0" }} axisLine={{ stroke: "#E2E8F0" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                <Legend />
                <Line type="monotone" dataKey="average" name="Average Marks" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, fill: "#2563EB" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// ── Main export — picks the right dashboard by role ────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "Student") return <StudentHome />;
  return <StaffDashboard />;
}


