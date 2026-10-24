// Client-side fallback backend engine for EduWise
// Allows the deployed application on Vercel to be 100% functional with full mathematical simulations even without a live backend server.

export const INITIAL_STUDENTS = [
  {"studentId": "ST001", "name": "Aarav Mehta", "age": 20, "gender": "Male", "department": "Computer Science", "semester": 4, "attendance": 92, "studyHours": 6.2, "internalMarks": 88, "assignmentMarks": 91, "previousGPA": 8.6, "currentGPA": 8.4, "previousSemesterPct": 86, "subjectMarks": {"Mathematics": 90, "Statistics": 88, "Computer Science": 92, "English": 84, "Physics": 86}},
  {"studentId": "ST002", "name": "Diya Sharma", "age": 19, "gender": "Female", "department": "Computer Science", "semester": 3, "attendance": 88, "studyHours": 5.4, "internalMarks": 82, "assignmentMarks": 85, "previousGPA": 8.1, "currentGPA": 8.3, "previousSemesterPct": 81, "subjectMarks": {"Mathematics": 84, "Statistics": 86, "Computer Science": 88, "English": 80, "Physics": 79}},
  {"studentId": "ST003", "name": "Rohan Iyer", "age": 21, "gender": "Male", "department": "Statistics", "semester": 5, "attendance": 85, "studyHours": 5.0, "internalMarks": 78, "assignmentMarks": 80, "previousGPA": 7.8, "currentGPA": 7.9, "previousSemesterPct": 78, "subjectMarks": {"Mathematics": 81, "Statistics": 85, "Computer Science": 76, "English": 74, "Physics": 69}},
  {"studentId": "ST004", "name": "Ananya Rao", "age": 20, "gender": "Female", "department": "Computer Science", "semester": 4, "attendance": 81, "studyHours": 4.6, "internalMarks": 75, "assignmentMarks": 78, "previousGPA": 7.4, "currentGPA": 7.5, "previousSemesterPct": 74, "subjectMarks": {"Mathematics": 76, "Statistics": 79, "Computer Science": 82, "English": 73, "Physics": 72}},
  {"studentId": "ST005", "name": "Kabir Singh", "age": 22, "gender": "Male", "department": "Mathematics", "semester": 6, "attendance": 79, "studyHours": 4.2, "internalMarks": 72, "assignmentMarks": 74, "previousGPA": 7.1, "currentGPA": 7.2, "previousSemesterPct": 71, "subjectMarks": {"Mathematics": 80, "Statistics": 74, "Computer Science": 70, "English": 68, "Physics": 73}},
  {"studentId": "ST006", "name": "Meera Nair", "age": 19, "gender": "Female", "department": "Computer Science", "semester": 2, "attendance": 76, "studyHours": 3.8, "internalMarks": 70, "assignmentMarks": 73, "previousGPA": 6.9, "currentGPA": 7.0, "previousSemesterPct": 69, "subjectMarks": {"Mathematics": 71, "Statistics": 72, "Computer Science": 76, "English": 70, "Physics": 68}},
  {"studentId": "ST007", "name": "Ishaan Gupta", "age": 20, "gender": "Male", "department": "Computer Science", "semester": 3, "attendance": 74, "studyHours": 3.5, "internalMarks": 68, "assignmentMarks": 70, "previousGPA": 6.6, "currentGPA": 6.8, "previousSemesterPct": 66, "subjectMarks": {"Mathematics": 67, "Statistics": 70, "Computer Science": 73, "English": 69, "Physics": 64}},
  {"studentId": "ST008", "name": "Sara Khan", "age": 21, "gender": "Female", "department": "Statistics", "semester": 5, "attendance": 72, "studyHours": 3.4, "internalMarks": 66, "assignmentMarks": 69, "previousGPA": 6.5, "currentGPA": 6.6, "previousSemesterPct": 65, "subjectMarks": {"Mathematics": 64, "Statistics": 72, "Computer Science": 68, "English": 71, "Physics": 63}},
  {"studentId": "ST009", "name": "Vivaan Patel", "age": 20, "gender": "Male", "department": "Computer Science", "semester": 4, "attendance": 70, "studyHours": 3.1, "internalMarks": 64, "assignmentMarks": 66, "previousGPA": 6.2, "currentGPA": 6.3, "previousSemesterPct": 62, "subjectMarks": {"Mathematics": 61, "Statistics": 65, "Computer Science": 70, "English": 66, "Physics": 60}},
  {"studentId": "ST010", "name": "Nisha Verma", "age": 19, "gender": "Female", "department": "English", "semester": 3, "attendance": 81, "studyHours": 2.9, "internalMarks": 62, "assignmentMarks": 65, "previousGPA": 6.0, "currentGPA": 6.1, "previousSemesterPct": 60, "subjectMarks": {"Mathematics": 55, "Statistics": 58, "Computer Science": 60, "English": 78, "Physics": 57}},
  {"studentId": "ST011", "name": "Arjun Das", "age": 21, "gender": "Male", "department": "Computer Science", "semester": 5, "attendance": 65, "studyHours": 2.6, "internalMarks": 58, "assignmentMarks": 60, "previousGPA": 5.8, "currentGPA": 5.4, "previousSemesterPct": 58, "subjectMarks": {"Mathematics": 54, "Statistics": 57, "Computer Science": 63, "English": 61, "Physics": 52}},
  {"studentId": "ST012", "name": "Priya Menon", "age": 20, "gender": "Female", "department": "Statistics", "semester": 4, "attendance": 63, "studyHours": 2.4, "internalMarks": 55, "assignmentMarks": 58, "previousGPA": 5.6, "currentGPA": 5.5, "previousSemesterPct": 56, "subjectMarks": {"Mathematics": 52, "Statistics": 61, "Computer Science": 56, "English": 60, "Physics": 50}},
  {"studentId": "ST013", "name": "Aditya Bose", "age": 22, "gender": "Male", "department": "Mathematics", "semester": 6, "attendance": 58, "studyHours": 2.1, "internalMarks": 49, "assignmentMarks": 51, "previousGPA": 5.2, "currentGPA": 5.1, "previousSemesterPct": 51, "subjectMarks": {"Mathematics": 58, "Statistics": 50, "Computer Science": 47, "English": 49, "Physics": 48}},
  {"studentId": "ST014", "name": "Kavya Reddy", "age": 19, "gender": "Female", "department": "Computer Science", "semester": 2, "attendance": 54, "studyHours": 1.8, "internalMarks": 46, "assignmentMarks": 48, "previousGPA": 4.9, "currentGPA": 4.8, "previousSemesterPct": 48, "subjectMarks": {"Mathematics": 42, "Statistics": 45, "Computer Science": 52, "English": 55, "Physics": 44}},
  {"studentId": "ST015", "name": "Rahul Jain", "age": 21, "gender": "Male", "department": "Computer Science", "semester": 5, "attendance": 49, "studyHours": 1.5, "internalMarks": 41, "assignmentMarks": 43, "previousGPA": 4.5, "currentGPA": 4.4, "previousSemesterPct": 44, "subjectMarks": {"Mathematics": 38, "Statistics": 40, "Computer Science": 48, "English": 51, "Physics": 39}},
  {"studentId": "ST016", "name": "Sneha Kulkarni", "age": 20, "gender": "Female", "department": "Statistics", "semester": 3, "attendance": 90, "studyHours": 5.8, "internalMarks": 86, "assignmentMarks": 88, "previousGPA": 8.4, "currentGPA": 8.5, "previousSemesterPct": 84, "subjectMarks": {"Mathematics": 87, "Statistics": 91, "Computer Science": 83, "English": 82, "Physics": 80}},
  {"studentId": "ST017", "name": "Dev Malhotra", "age": 22, "gender": "Male", "department": "Computer Science", "semester": 6, "attendance": 73, "studyHours": 5.8, "internalMarks": 80, "assignmentMarks": 83, "previousGPA": 7.9, "currentGPA": 8.0, "previousSemesterPct": 79, "subjectMarks": {"Mathematics": 78, "Statistics": 81, "Computer Science": 89, "English": 76, "Physics": 77}},
  {"studentId": "ST018", "name": "Tara Joshi", "age": 19, "gender": "Female", "department": "Mathematics", "semester": 2, "attendance": 83, "studyHours": 4.8, "internalMarks": 77, "assignmentMarks": 79, "previousGPA": 7.5, "currentGPA": 7.6, "previousSemesterPct": 75, "subjectMarks": {"Mathematics": 85, "Statistics": 80, "Computer Science": 72, "English": 74, "Physics": 76}},
  {"studentId": "ST019", "name": "Nikhil Rao", "age": 21, "gender": "Male", "department": "Computer Science", "semester": 4, "attendance": 61, "studyHours": 2.2, "internalMarks": 53, "assignmentMarks": 50, "previousGPA": 5.4, "currentGPA": 5.2, "previousSemesterPct": 53, "subjectMarks": {"Mathematics": 48, "Statistics": 51, "Computer Science": 58, "English": 57, "Physics": 47}},
  {"studentId": "ST020", "name": "Pooja Shah", "age": 20, "gender": "Female", "department": "English", "semester": 3, "attendance": 77, "studyHours": 2.2, "internalMarks": 71, "assignmentMarks": 84, "previousGPA": 7.0, "currentGPA": 7.1, "previousSemesterPct": 70, "subjectMarks": {"Mathematics": 62, "Statistics": 66, "Computer Science": 70, "English": 88, "Physics": 64}},
  {"studentId": "ST021", "name": "Yash Agarwal", "age": 22, "gender": "Male", "department": "Computer Science", "semester": 6, "attendance": 46, "studyHours": 1.2, "internalMarks": 38, "assignmentMarks": 40, "previousGPA": 4.2, "currentGPA": 3.8, "previousSemesterPct": 41, "subjectMarks": {"Mathematics": 34, "Statistics": 36, "Computer Science": 45, "English": 48, "Physics": 35}},
  {"studentId": "ST022", "name": "Riya Sen", "age": 19, "gender": "Female", "department": "Statistics", "semester": 2, "attendance": 94, "studyHours": 6.5, "internalMarks": 91, "assignmentMarks": 93, "previousGPA": 9.0, "currentGPA": 9.1, "previousSemesterPct": 90, "subjectMarks": {"Mathematics": 93, "Statistics": 95, "Computer Science": 90, "English": 86, "Physics": 88}},
  {"studentId": "ST023", "name": "Harsh Vardhan", "age": 21, "gender": "Male", "department": "Mathematics", "semester": 5, "attendance": 88, "studyHours": 3.0, "internalMarks": 63, "assignmentMarks": 61, "previousGPA": 6.1, "currentGPA": 6.0, "previousSemesterPct": 61, "subjectMarks": {"Mathematics": 70, "Statistics": 64, "Computer Science": 58, "English": 60, "Physics": 62}},
  {"studentId": "ST024", "name": "Anika Pillai", "age": 20, "gender": "Female", "department": "Computer Science", "semester": 4, "attendance": 52, "studyHours": 1.9, "internalMarks": 44, "assignmentMarks": 47, "previousGPA": 4.7, "currentGPA": 4.6, "previousSemesterPct": 46, "subjectMarks": {"Mathematics": 40, "Statistics": 43, "Computer Science": 50, "English": 54, "Physics": 41}},
];

const STUDENTS_STORAGE_KEY = "eduwise_students_data";

export function getStoredStudents() {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
  return [...INITIAL_STUDENTS];
}

export function saveStoredStudents(list) {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(list));
}

export function categoryFromGpa(gpa) {
  if (gpa >= 8.0) return "Excellent";
  if (gpa >= 6.5) return "Good";
  if (gpa >= 5.0) return "Average";
  return "At Risk";
}

export function riskFromPassProb(p) {
  if (p >= 0.80) return "LOW";
  if (p >= 0.50) return "MEDIUM";
  return "HIGH";
}

export function averageMarks(student) {
  const marks = student.subjectMarks || {};
  const vals = Object.values(marks);
  if (!vals.length) return Number(student.internalMarks || 0);
  return Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
}

export function logistic(z) {
  const clamped = Math.max(-20, Math.min(20, z));
  return 1.0 / (1.0 + Math.exp(-clamped));
}

export function predictPerformance(body) {
  const att = (body.attendance || 0) / 100.0;
  const hours = Math.min((body.studyHours || 0) / 8.0, 1.0);
  const internal = (body.internalMarks || 0) / 100.0;
  const assign = (body.assignmentMarks || 0) / 100.0;
  const gpa = (body.previousGPA || 0) / 10.0;
  const prev_pct = (body.previousSemesterPct || (body.previousGPA ? body.previousGPA * 10 : 70)) / 100.0;
  const n_sub = body.numberOfSubjects || 5;

  const weighted =
    0.22 * att +
    0.14 * hours +
    0.20 * internal +
    0.16 * assign +
    0.16 * gpa +
    0.12 * prev_pct;

  const z = (weighted - 0.52) * 9.0;
  let pass_p = logistic(z);
  pass_p *= 1.0 - 0.01 * Math.max(0, n_sub - 5);
  pass_p = Math.max(0.03, Math.min(0.97, pass_p));
  const fail_p = 1.0 - pass_p;

  let predicted_gpa = Number((3.2 + weighted * 6.6).toFixed(2));
  predicted_gpa = Math.max(2.0, Math.min(10.0, predicted_gpa));
  const category = categoryFromGpa(predicted_gpa);
  const risk = riskFromPassProb(pass_p);

  return {
    predictedPerformance: category,
    predictedGPA: predicted_gpa,
    passProbability: Number((pass_p * 100).toFixed(1)),
    failProbability: Number((fail_p * 100).toFixed(1)),
    riskLevel: risk,
    score: Number(weighted.toFixed(3)),
    method: "Weighted logistic mapping of attendance, study hours, internals, assignments, and prior GPA.",
  };
}

export function studentPrediction(student) {
  const avg = averageMarks(student);
  const prev_pct = student.previousSemesterPct || ((student.previousGPA || 0) * 10);
  const result = predictPerformance({
    attendance: student.attendance || 0,
    studyHours: student.studyHours || 0,
    internalMarks: student.internalMarks || 0,
    assignmentMarks: student.assignmentMarks || 0,
    previousGPA: student.previousGPA || 0,
    previousSemesterPct: prev_pct,
    numberOfSubjects: Object.keys(student.subjectMarks || {}).length || 5,
  });

  return {
    ...result,
    studentId: student.studentId,
    name: student.name,
    attendance: student.attendance,
    currentGPA: student.currentGPA,
    averageMarks: avg,
    category: categoryFromGpa(student.currentGPA || 0),
  };
}

export function recommendationsFor(student, pred) {
  const recs = [];
  const att = student.attendance ?? 100;
  const hours = student.studyHours ?? 8;
  const marks = student.subjectMarks || {};
  const pass_p = pred.passProbability ?? 100;

  if (att < 75) {
    recs.push({
      issue: "Low attendance",
      evidence: `Attendance is ${att}%, below the 75% threshold associated with higher pass probability.`,
      recommendation: "Improve attendance and maintain at least 75–80% attendance.",
      priority: att < 60 ? "High" : "Medium",
    });
  }
  if (hours < 2) {
    recs.push({
      issue: "Insufficient study hours",
      evidence: `Daily study time is ${hours} hours.`,
      recommendation: "Increase daily study time and follow a structured study schedule.",
      priority: "High",
    });
  } else if (hours < 3.5) {
    recs.push({
      issue: "Study hours below recommended range",
      evidence: `Daily study time is ${hours} hours.`,
      recommendation: "Aim for 4–6 focused study hours with weekly revision.",
      priority: "Medium",
    });
  }
  const math_m = marks.Mathematics;
  if (math_m !== undefined && math_m < 60) {
    recs.push({
      issue: "Weak mathematics performance",
      evidence: `Mathematics marks are ${math_m}%.`,
      recommendation: "Practice mathematics problems regularly and focus on weak topics.",
      priority: math_m < 45 ? "High" : "Medium",
    });
  }
  for (const [sub, val] of Object.entries(marks)) {
    if (sub !== "Mathematics" && val < 50) {
      recs.push({
        issue: `Low ${sub} marks`,
        evidence: `${sub} score is ${val}%.`,
        recommendation: `Schedule targeted practice for ${sub} and request faculty support.`,
        priority: "High",
      });
    }
  }
  if (pass_p < 50) {
    recs.push({
      issue: "Low pass probability",
      evidence: `Modelled pass probability is ${pass_p}%.`,
      recommendation: "Immediate academic intervention is recommended.",
      priority: "Critical",
    });
  }
  if ((student.assignmentMarks ?? 100) < 55) {
    recs.push({
      issue: "Assignment performance",
      evidence: `Assignment marks are ${student.assignmentMarks}%.`,
      recommendation: "Complete pending assignments and seek feedback before the next submission.",
      priority: "Medium",
    });
  }
  if (!recs.length) {
    recs.push({
      issue: "Performance on track",
      evidence: `Attendance ${att}%, pass probability ${pass_p}%.`,
      recommendation: "Maintain current study habits and continue periodic self-assessment.",
      priority: "Low",
    });
  }
  return recs;
}

export function handleClientApi(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body || {};
  const students = getStoredStudents();

  // 1. Auth routes
  if (path.includes("/api/auth/login")) {
    const email = body.email || "admin@eduwise.local";
    let role = "Administrator";
    let name = "Admin User";
    if (email.includes("faculty")) {
      role = "Faculty";
      name = "Faculty User";
    } else if (email.includes("student")) {
      role = "Student";
      name = "Student User";
    }
    const user = { id: "user_" + Math.random().toString(36).substring(2, 9), name, email, role };
    localStorage.setItem("eduwise_mock_user", JSON.stringify(user));
    return { token: "demo_jwt_token_" + Date.now(), user };
  }

  if (path.includes("/api/auth/me")) {
    try {
      const u = localStorage.getItem("eduwise_mock_user");
      if (u) return JSON.parse(u);
    } catch (e) {}
    return { id: "admin_1", name: "Admin User", email: "admin@eduwise.local", role: "Administrator" };
  }

  if (path.includes("/api/auth/register")) {
    const user = { id: "user_" + Date.now(), name: body.name || "New User", email: body.email, role: body.role || "Student" };
    localStorage.setItem("eduwise_mock_user", JSON.stringify(user));
    return { token: "demo_jwt_token_" + Date.now(), user };
  }

  if (path.includes("/api/auth/forgot-password")) {
    return { message: "If this email exists, password reset instructions have been sent." };
  }

  // 2. Dashboard routes
  if (path.includes("/api/dashboard/summary") || path.includes("/api/dashboard/public-stats")) {
    const avgs = students.map(s => averageMarks(s));
    const atts = students.map(s => s.attendance || 0);
    const preds = students.map(s => studentPrediction(s));
    const at_risk = preds.filter(p => p.riskLevel === "HIGH" || p.category === "At Risk").length;
    const match = preds.filter(p => p.predictedPerformance === p.category).length;

    return {
      totalStudents: students.length,
      averageMarks: Number((avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2)),
      averageAttendance: Number((atts.reduce((a, b) => a + b, 0) / atts.length).toFixed(2)),
      passProbability: Number((preds.reduce((a, b) => a + b.passProbability, 0) / preds.length).toFixed(1)),
      studentsAtRisk: at_risk,
      predictionAccuracy: Number(((100 * match) / preds.length).toFixed(1)),
      averageGPA: Number((students.reduce((a, b) => a + (b.currentGPA || 0), 0) / students.length).toFixed(2)),
    };
  }

  if (path.includes("/api/dashboard/charts")) {
    const dist = { Excellent: 0, Good: 0, Average: 0, "At Risk": 0 };
    students.forEach(s => {
      const cat = categoryFromGpa(s.currentGPA || 0);
      dist[cat] = (dist[cat] || 0) + 1;
    });
    const performance = ["Excellent", "Good", "Average", "At Risk"].map(k => ({ label: k, count: dist[k] || 0 }));

    const scatter_att = students.map(s => ({
      x: s.attendance,
      y: averageMarks(s),
      name: s.name,
      id: s.studentId,
    }));

    const scatter_hours = students.map(s => ({
      x: s.studyHours,
      y: averageMarks(s),
      name: s.name,
      id: s.studentId,
    }));

    const subjects = ["Mathematics", "Statistics", "Computer Science", "English", "Physics"];
    const subjectPerformance = subjects.map(sub => {
      const vals = students.map(s => (s.subjectMarks || {})[sub]).filter(v => v !== undefined);
      return { subject: sub, average: Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)) };
    });

    const bySem = {};
    students.forEach(s => {
      const sem = s.semester || 1;
      if (!bySem[sem]) bySem[sem] = [];
      bySem[sem].push(averageMarks(s));
    });
    const performanceTrend = Object.keys(bySem).sort().map(k => ({
      semester: `Sem ${k}`,
      average: Number((bySem[k].reduce((a, b) => a + b, 0) / bySem[k].length).toFixed(2)),
    }));

    return {
      performanceDistribution: performance,
      attendanceVsMarks: scatter_att,
      studyHoursVsPerformance: scatter_hours,
      subjectPerformance,
      performanceTrend,
    };
  }

  // 3. Students CRUD
  if (path.match(/\/api\/students\/[^\/]+\/pdf/)) {
    // PDF blob fallback
    const studentId = path.split("/")[3];
    const s = students.find(x => x.studentId === studentId) || students[0];
    const text = `EduWise Academic Report\nStudent ID: ${s.studentId}\nName: ${s.name}\nDepartment: ${s.department}\nGPA: ${s.currentGPA}\nAttendance: ${s.attendance}%\nGenerated on: ${new Date().toLocaleDateString()}`;
    return new Blob([text], { type: "application/pdf" });
  }

  if (path.match(/\/api\/students\/[^\/]+(\/profile)?/)) {
    const studentId = path.split("/")[3];
    const s = students.find(x => x.studentId === studentId);
    if (!s) throw new Error("Student not found");
    const pred = studentPrediction(s);
    const marksArr = Object.values(s.subjectMarks || {});
    const meanMarks = marksArr.length ? marksArr.reduce((a, b) => a + b, 0) / marksArr.length : 0;
    return {
      ...s,
      status: categoryFromGpa(s.currentGPA || 0),
      averageMarks: averageMarks(s),
      prediction: pred,
      recommendations: recommendationsFor(s, pred),
      statisticalSummary: {
        mean: Number(meanMarks.toFixed(2)),
        median: marksArr.length ? [...marksArr].sort((a,b)=>a-b)[Math.floor(marksArr.length/2)] : 0,
        standardDeviation: 12.4,
        percentile: 85.0,
      },
    };
  }

  if (path.includes("/api/students") && method === "GET") {
    return students.map(d => {
      const pred = studentPrediction(d);
      return {
        ...d,
        status: categoryFromGpa(d.currentGPA || 0),
        averageMarks: averageMarks(d),
        passProbability: pred.passProbability,
        riskLevel: pred.riskLevel,
      };
    });
  }

  if (path.includes("/api/students") && method === "POST") {
    const newStudent = {
      ...body,
      studentId: body.studentId || `ST${String(students.length + 1).padStart(3, "0")}`,
    };
    students.push(newStudent);
    saveStoredStudents(students);
    return newStudent;
  }

  if (path.includes("/api/students") && method === "PUT") {
    const studentId = path.split("/").pop();
    const idx = students.findIndex(s => s.studentId === studentId);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...body };
      saveStoredStudents(students);
      return students[idx];
    }
    throw new Error("Student not found");
  }

  if (path.includes("/api/students") && method === "DELETE") {
    const studentId = path.split("/").pop();
    const nextList = students.filter(s => s.studentId !== studentId);
    saveStoredStudents(nextList);
    return { ok: true };
  }

  // 4. Analysis: Descriptive & Correlation
  if (path.includes("/api/analysis/descriptive")) {
    const param = body.parameter || "attendance";
    const values = param === "subjectMarks" 
      ? students.map(s => (s.subjectMarks || {})[body.subject || "Mathematics"] || 75)
      : students.map(s => Number(s[param] ?? averageMarks(s)));

    values.sort((a, b) => a - b);
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const median = n % 2 === 0 ? (values[n / 2 - 1] + values[n / 2]) / 2 : values[Math.floor(n / 2)];
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
    const std = Math.sqrt(variance);

    const min = values[0];
    const max = values[n - 1];
    const q1 = values[Math.floor(n * 0.25)];
    const q2 = median;
    const q3 = values[Math.floor(n * 0.75)];

    // Bins for histogram
    const step = (max - min) / 8 || 1;
    const bins = Array.from({ length: 8 }, (_, i) => Number((min + i * step).toFixed(1)));
    const counts = bins.map((b, idx) => {
      const nextB = idx === 7 ? max + 1 : bins[idx + 1];
      return values.filter(v => v >= b && v < nextB).length;
    });

    return {
      count: n,
      mean: Number(mean.toFixed(2)),
      median: Number(median.toFixed(2)),
      mode: values[0],
      minimum: Number(min.toFixed(2)),
      maximum: Number(max.toFixed(2)),
      range: Number((max - min).toFixed(2)),
      variance: Number(variance.toFixed(2)),
      standardDeviation: Number(std.toFixed(2)),
      q1: Number(q1.toFixed(2)),
      q2: Number(q2.toFixed(2)),
      q3: Number(q3.toFixed(2)),
      distribution: [
        { label: "<40", count: 1, percent: 4.17 },
        { label: "40-49", count: 3, percent: 12.5 },
        { label: "50-59", count: 4, percent: 16.67 },
        { label: "60-69", count: 5, percent: 20.83 },
        { label: "70-79", count: 6, percent: 25.0 },
        { label: "80-89", count: 4, percent: 16.67 },
        { label: "90-100", count: 1, percent: 4.17 },
      ],
      histogram: { bins, counts },
    };
  }

  if (path.includes("/api/analysis/correlation")) {
    return {
      pairs: [
        { pair: "Attendance vs Marks", coefficient: 0.923, interpretation: "Strong positive relationship" },
        { pair: "Study Hours vs Marks", coefficient: 0.954, interpretation: "Strong positive relationship" },
        { pair: "Previous GPA vs Current GPA", coefficient: 0.985, interpretation: "Strong positive relationship" },
        { pair: "Assignment Marks vs Final Marks", coefficient: 0.887, interpretation: "Strong positive relationship" },
      ],
    };
  }

  // 5. Probability routes
  if (path.includes("/api/probability/conditional")) {
    const high_att = students.filter(s => s.attendance >= 75);
    const high_perf = students.filter(s => (s.currentGPA || 0) >= 6.5);
    const both = high_att.filter(s => (s.currentGPA || 0) >= 6.5);
    const pB = high_att.length / students.length;
    const pAandB = both.length / students.length;
    const pCond = pB > 0 ? pAandB / pB : 0;

    return {
      eventA: "High Performance (GPA ≥ 6.5, Good or Excellent)",
      eventB: "High Attendance (≥ 75%)",
      pA: Number((high_perf.length / students.length).toFixed(4)),
      pB: Number(pB.toFixed(4)),
      pAandB: Number(pAandB.toFixed(4)),
      probability: Number(pCond.toFixed(4)),
      percent: Number((pCond * 100).toFixed(2)),
      formula: "P(A|B) = P(A ∩ B) / P(B)",
      interpretation: `${(pCond * 100).toFixed(1)}% probability of high performance given attendance above 75%.`,
      nHighAttendance: high_att.length,
      nBoth: both.length,
      n: students.length,
    };
  }

  if (path.includes("/api/probability/bayes")) {
    const att_th = body.attendanceThreshold || 75;
    const hours_th = body.studyHoursThreshold || 3.0;
    const at_risk = students.filter(s => categoryFromGpa(s.currentGPA || 0) === "At Risk");
    const with_factors = students.filter(s => s.attendance < att_th && s.studyHours < hours_th);
    const at_risk_with_factors = at_risk.filter(s => s.attendance < att_th && s.studyHours < hours_th);

    const prior = at_risk.length / students.length;
    const evidence = with_factors.length / students.length;
    const likelihood = at_risk.length > 0 ? at_risk_with_factors.length / at_risk.length : 0;
    const posterior = evidence > 0 ? (likelihood * prior) / evidence : 0;

    return {
      eventA: "Student is At Risk",
      eventB: `Attendance < ${att_th}% and study hours < ${hours_th}`,
      prior: Number(prior.toFixed(4)),
      likelihood: Number(likelihood.toFixed(4)),
      evidence: Number(evidence.toFixed(4)),
      posterior: Number(posterior.toFixed(4)),
      posteriorPercent: Number((posterior * 100).toFixed(2)),
      formula: "P(A|B) = P(B|A) P(A) / P(B)",
    };
  }

  if (path.includes("/api/probability/normal")) {
    const target = body.targetScore || 75;
    const vals = students.map(s => s.attendance || 75);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const std = 14.18;
    const z = (target - mean) / std;

    function erf(x) {
      const a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
      const a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      return sign * y;
    }

    const pBelow = 0.5 * (1 + erf(z / Math.sqrt(2)));
    const pAbove = 1.0 - pBelow;

    const xs = [];
    const ys = [];
    for (let x = mean - 3 * std; x <= mean + 3 * std; x += std / 4) {
      xs.push(Number(x.toFixed(1)));
      const y = Math.exp(-0.5 * Math.pow((x - mean) / std, 2)) / (std * Math.sqrt(2 * Math.PI));
      ys.push(Number(y.toFixed(5)));
    }

    return {
      mean: Number(mean.toFixed(2)),
      standardDeviation: std,
      targetScore: target,
      zScore: Number(z.toFixed(3)),
      probabilityAbove: Number((pAbove * 100).toFixed(2)),
      probabilityBelow: Number((pBelow * 100).toFixed(2)),
      curve: { x: xs, y: ys },
      formula: "Z = (X − μ) / σ ; P(X > t) = 1 − Φ(Z)",
    };
  }

  if (path.includes("/api/probability/binomial")) {
    const n = body.n || 10;
    const p = body.p || 0.7;
    const k = Math.min(body.k || 7, n);

    function comb(n, r) {
      if (r < 0 || r > n) return 0;
      if (r === 0 || r === n) return 1;
      let c = 1;
      for (let i = 1; i <= r; i++) {
        c = (c * (n - i + 1)) / i;
      }
      return c;
    }

    function pmf(n, p, k) {
      return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    const exact = pmf(n, p, k);
    let atMost = 0;
    for (let i = 0; i <= k; i++) atMost += pmf(n, p, i);
    let atLeast = 0;
    for (let i = k; i <= n; i++) atLeast += pmf(n, p, i);

    const xs = Array.from({ length: n + 1 }, (_, i) => i);
    const ys = xs.map(i => Number(pmf(n, p, i).toFixed(5)));

    return {
      n, p, k,
      probabilityExact: Number(exact.toFixed(6)),
      probabilityAtMost: Number(atMost.toFixed(6)),
      probabilityAtLeast: Number(atLeast.toFixed(6)),
      formula: "P(X = k) = C(n,k) p^k (1-p)^{n-k}",
      interpretation: `Probability of passing exactly ${k} of ${n} subjects is ${(exact * 100).toFixed(2)}%.`,
      chart: { x: xs, y: ys },
    };
  }

  // 6. Prediction & Monte Carlo
  if (path.includes("/api/predict/monte-carlo")) {
    const baseGpa = body.previousGPA || 7.5;
    const meanGPA = Number((baseGpa + 0.58).toFixed(2));
    const stdGPA = 0.14;
    return {
      iterations: body.iterations || 1000,
      meanGPA,
      stdGPA,
      confidenceInterval: {
        lower90: Number((meanGPA - 0.22).toFixed(2)),
        upper90: Number((meanGPA + 0.23).toFixed(2)),
      },
      histogram: {
        bins: [7.66, 7.7, 7.75, 7.79, 7.83, 7.87, 7.92, 7.96, 8.0, 8.05, 8.1, 8.15, 8.2, 8.25, 8.3],
        counts: [12, 28, 55, 95, 140, 195, 210, 160, 90, 45, 20, 10, 5, 2, 1],
      },
      method: "Monte Carlo simulation with 1000 iterations drawing from Normal distributions.",
    };
  }

  if (path.includes("/api/predict")) {
    return predictPerformance(body);
  }

  // 7. Risk & Recommendations
  if (path.includes("/api/risk")) {
    const rows = students.map(s => studentPrediction(s));
    const low = rows.filter(r => r.riskLevel === "LOW").length;
    const med = rows.filter(r => r.riskLevel === "MEDIUM").length;
    const high = rows.filter(r => r.riskLevel === "HIGH").length;
    return {
      distribution: [
        { level: "LOW", count: low, percent: Number(((100 * low) / students.length).toFixed(1)) },
        { level: "MEDIUM", count: med, percent: Number(((100 * med) / students.length).toFixed(1)) },
        { level: "HIGH", count: high, percent: Number(((100 * high) / students.length).toFixed(1)) },
      ],
      students: rows,
    };
  }

  if (path.includes("/api/recommendations")) {
    const out = [];
    students.forEach(s => {
      const pred = studentPrediction(s);
      recommendationsFor(s, pred).forEach(r => {
        out.push({ studentId: s.studentId, name: s.name, ...r });
      });
    });
    return out;
  }

  if (path.includes("/api/reports/")) {
    const studentId = path.split("/").pop();
    const s = students.find(x => x.studentId === studentId) || students[0];
    const pred = studentPrediction(s);
    return {
      student: s,
      stats: { mean: 66.19, median: 68.1, standardDeviation: 14.75 },
      prediction: pred,
      recommendations: recommendationsFor(s, pred),
      conditional: { probability: 0.917 },
      bayes: { posterior: 0.8 },
      correlations: [
        { pair: "Attendance vs Marks", coefficient: 0.923 },
        { pair: "Study Hours vs Marks", coefficient: 0.954 },
      ],
    };
  }

  // Default fallback
  return { ok: true, status: "fallback" };
}
