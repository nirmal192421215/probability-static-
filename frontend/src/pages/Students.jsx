import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Confirm, EmptyState, Modal, PageHeader, RiskBadge, Spinner } from "../components/ui";

const empty = {
  studentId: "",
  name: "",
  age: 20,
  gender: "Female",
  department: "Computer Science",
  semester: 4,
  attendance: 75,
  studyHours: 4,
  internalMarks: 70,
  assignmentMarks: 70,
  previousGPA: 7,
  currentGPA: 7,
  previousSemesterPct: 70,
  subjectMarks: { Mathematics: 70, Statistics: 70, "Computer Science": 70, English: 70, Physics: 70 },
};

export default function Students() {
  const { user } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [delId, setDelId] = useState(null);
  const canEdit = ["Administrator", "Faculty"].includes(user?.role);
  const canDelete = canEdit;

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (department) params.set("department", department);
      if (semester) params.set("semester", semester);
      const data = await api(`/api/students?${params.toString()}`);
      setRows(data);
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status, department, semester]);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e) {
    e.preventDefault();
    try {
      const payload = { ...form, age: +form.age, semester: +form.semester };
      if (editing) await api(`/api/students/${form.studentId}`, { method: "PUT", body: payload });
      else await api("/api/students", { method: "POST", body: payload });
      push(editing ? "Student updated" : "Student added");
      setOpen(false);
      load();
    } catch (err) {
      push(err.message, "error");
    }
  }

  return (
    <div>
      <PageHeader
        title="Student Data Management"
        subtitle="Add, search, filter, and review academic records"
        actions={
          canEdit && (
            <button
              className="btn-primary"
              onClick={() => {
                setForm({ ...empty, studentId: `ST${String(rows.length + 25).padStart(3, "0")}` });
                setEditing(false);
                setOpen(true);
              }}
            >
              Add student
            </button>
          )
        }
      />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <input className="input sm:col-span-2" placeholder="Search name or ID" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Average</option>
          <option>At Risk</option>
        </select>
        <select className="input" value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All departments</option>
          <option>Computer Science</option>
          <option>Statistics</option>
          <option>Mathematics</option>
          <option>English</option>
        </select>
        <select className="input" value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="">All semesters</option>
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              Semester {n}
            </option>
          ))}
        </select>
        <button className="btn-secondary" type="button" onClick={load}>
          Search
        </button>
      </div>
      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <EmptyState title="No students found" text="Adjust search or filters, or add a student record." />
      ) : (
        <div className="card overflow-hidden border border-slate-200/80 shadow-soft">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm divide-y divide-slate-200">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-3.5 text-left">Student ID</th>
                  <th className="px-4 py-3.5 text-left">Name</th>
                  <th className="px-4 py-3.5 text-center">Attendance</th>
                  <th className="px-4 py-3.5 text-center">Study Hours</th>
                  <th className="px-4 py-3.5 text-center">GPA</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-navy-950 font-mono">{r.studentId}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{r.name}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-medium">{r.attendance}%</td>
                    <td className="px-4 py-3.5 text-center font-mono">{r.studyHours}h</td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-navy-950">{r.currentGPA}</td>
                    <td className="px-4 py-3.5 text-center">
                      <RiskBadge level={r.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button 
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-accent-50 text-accent-700 hover:bg-accent-100 transition-colors"
                          onClick={() => nav(`/app/students/${r.studentId}`)}
                        >
                          View
                        </button>
                        {canEdit && (
                          <button
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            onClick={() => {
                              setForm({ ...empty, ...r, subjectMarks: r.subjectMarks || empty.subjectMarks });
                              setEditing(true);
                              setOpen(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button 
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" 
                            onClick={() => setDelId(r.studentId)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={open} title={editing ? "Edit student" : "Add student"} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          {["studentId", "name", "age", "gender", "department", "semester", "attendance", "studyHours", "internalMarks", "assignmentMarks", "previousGPA", "currentGPA", "previousSemesterPct"].map((k) => (
            <div key={k}>
              <label className="text-xs font-semibold uppercase text-slate-500">{k}</label>
              {k === "gender" ? (
                <select className="input mt-1" value={form[k]} onChange={(e) => setField(k, e.target.value)}>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              ) : (
                <input className="input mt-1" value={form[k]} onChange={(e) => setField(k, e.target.value)} required />
              )}
            </div>
          ))}
          {Object.keys(form.subjectMarks).map((sub) => (
            <div key={sub}>
              <label className="text-xs font-semibold uppercase text-slate-500">{sub}</label>
              <input
                className="input mt-1"
                type="number"
                value={form.subjectMarks[sub]}
                onChange={(e) => setForm((f) => ({ ...f, subjectMarks: { ...f.subjectMarks, [sub]: +e.target.value } }))}
              />
            </div>
          ))}
          <div className="sm:col-span-2 mt-2 flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
      <Confirm
        open={!!delId}
        text={`Delete ${delId}? This cannot be undone.`}
        onClose={() => setDelId(null)}
        onConfirm={async () => {
          try {
            await api(`/api/students/${delId}`, { method: "DELETE" });
            push("Student deleted");
            setDelId(null);
            load();
          } catch (e) {
            push(e.message, "error");
          }
        }}
      />
    </div>
  );
}
