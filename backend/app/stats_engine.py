from __future__ import annotations

import math
from collections import Counter
from typing import Any

import numpy as np
import pandas as pd

SUBJECTS = ["Mathematics", "Statistics", "Computer Science", "English", "Physics"]

HIGH_ATTENDANCE = 75.0
HIGH_GPA = 6.5
PASS_MARK = 50.0


def category_from_gpa(gpa: float) -> str:
    if gpa >= 8.0:
        return "Excellent"
    if gpa >= 6.5:
        return "Good"
    if gpa >= 5.0:
        return "Average"
    return "At Risk"


def risk_from_pass_prob(p: float) -> str:
    if p >= 0.80:
        return "LOW"
    if p >= 0.50:
        return "MEDIUM"
    return "HIGH"


def average_marks(student: dict) -> float:
    marks = student.get("subjectMarks") or {}
    if not marks:
        return float(student.get("internalMarks") or 0)
    return float(np.mean(list(marks.values())))


def interpret_corr(r: float) -> str:
    mag = abs(r)
    if mag >= 0.7:
        strength = "Strong"
    elif mag >= 0.4:
        strength = "Moderate"
    elif mag >= 0.2:
        strength = "Weak"
    else:
        strength = "Negligible"
    direction = "positive" if r >= 0 else "negative"
    return f"{strength} {direction} relationship"


def _series(students: list[dict], key: str, subject: str | None = None) -> np.ndarray:
    values = []
    for s in students:
        if key == "averageMarks":
            values.append(average_marks(s))
        elif key == "subject" and subject:
            values.append(float((s.get("subjectMarks") or {}).get(subject, np.nan)))
        else:
            values.append(float(s.get(key, np.nan)))
    arr = np.array(values, dtype=float)
    return arr[~np.isnan(arr)]


def descriptive(students: list[dict], parameter: str, subject: str | None = None) -> dict[str, Any]:
    data = _series(students, "subject" if parameter == "subjectMarks" else parameter, subject)
    if data.size == 0:
        return {"count": 0}

    series = pd.Series(data)
    mean = float(series.mean())
    median = float(series.median())
    modes = series.round(2).mode()
    mode = float(modes.iloc[0]) if not modes.empty else mean
    vmin = float(series.min())
    vmax = float(series.max())
    variance = float(series.var(ddof=1)) if data.size > 1 else 0.0
    std = float(series.std(ddof=1)) if data.size > 1 else 0.0
    q1, q2, q3 = [float(x) for x in series.quantile([0.25, 0.5, 0.75]).tolist()]

    bins = [0, 40, 50, 60, 70, 80, 90, 101]
    labels = ["<40", "40-49", "50-59", "60-69", "70-79", "80-89", "90-100"]
    if parameter in ("currentGPA", "previousGPA"):
        bins = [0, 5, 6.5, 8, 10.01]
        labels = ["At Risk (<5)", "Average (5-6.5)", "Good (6.5-8)", "Excellent (8+)"]

    hist_counts, _ = np.histogram(data, bins=bins)
    total = data.size
    distribution = [
        {"label": labels[i], "count": int(hist_counts[i]), "percent": round(100 * hist_counts[i] / total, 2)}
        for i in range(len(labels))
    ]

    hist_bins = np.linspace(float(vmin), float(vmax) if vmax > vmin else vmin + 1, 9)
    hist_y, hist_x = np.histogram(data, bins=hist_bins)

    return {
        "count": int(total),
        "mean": round(mean, 2),
        "median": round(median, 2),
        "mode": round(mode, 2),
        "minimum": round(vmin, 2),
        "maximum": round(vmax, 2),
        "range": round(vmax - vmin, 2),
        "variance": round(variance, 2),
        "standardDeviation": round(std, 2),
        "q1": round(q1, 2),
        "q2": round(q2, 2),
        "q3": round(q3, 2),
        "distribution": distribution,
        "histogram": {
            "bins": [round(float(x), 2) for x in hist_x[:-1]],
            "counts": [int(x) for x in hist_y],
        },
        "formulaNote": "Variance and standard deviation use sample formulas (ddof=1).",
    }


def correlations(students: list[dict]) -> list[dict[str, Any]]:
    frame = pd.DataFrame(
        [
            {
                "attendance": float(s.get("attendance", np.nan)),
                "marks": average_marks(s),
                "studyHours": float(s.get("studyHours", np.nan)),
                "previousGPA": float(s.get("previousGPA", np.nan)),
                "currentGPA": float(s.get("currentGPA", np.nan)),
                "assignmentMarks": float(s.get("assignmentMarks", np.nan)),
            }
            for s in students
        ]
    )
    pairs = [
        ("Attendance vs Marks", "attendance", "marks"),
        ("Study Hours vs Marks", "studyHours", "marks"),
        ("Previous GPA vs Current GPA", "previousGPA", "currentGPA"),
        ("Assignment Marks vs Final Marks", "assignmentMarks", "marks"),
    ]
    results = []
    for name, a, b in pairs:
        subset = frame[[a, b]].dropna()
        if len(subset) < 3:
            r = 0.0
        else:
            r = float(subset[a].corr(subset[b], method="pearson"))
            if math.isnan(r):
                r = 0.0
        results.append(
            {
                "pair": name,
                "coefficient": round(r, 3),
                "interpretation": interpret_corr(r),
            }
        )
    return results


def filter_students(students: list[dict], semester: int | None = None, dataset: str = "all") -> list[dict]:
    out = students
    if semester:
        out = [s for s in out if int(s.get("semester", 0)) == semester]
    if dataset == "at_risk":
        out = [s for s in out if category_from_gpa(s.get("currentGPA", 0)) == "At Risk"]
    elif dataset == "high_performers":
        out = [s for s in out if category_from_gpa(s.get("currentGPA", 0)) in ("Excellent", "Good")]
    return out


def logistic(z: float) -> float:
    z = max(-20, min(20, z))
    return 1.0 / (1.0 + math.exp(-z))


def predict_performance(body: dict) -> dict[str, Any]:
    att = body["attendance"] / 100.0
    hours = min(body["studyHours"] / 8.0, 1.0)
    internal = body["internalMarks"] / 100.0
    assign = body["assignmentMarks"] / 100.0
    gpa = body["previousGPA"] / 10.0
    prev_pct = body["previousSemesterPct"] / 100.0
    n_sub = body.get("numberOfSubjects", 5)

    weighted = (
        0.22 * att
        + 0.14 * hours
        + 0.20 * internal
        + 0.16 * assign
        + 0.16 * gpa
        + 0.12 * prev_pct
    )
    z = (weighted - 0.52) * 9.0
    pass_p = logistic(z)
    # slight adjustment: more subjects slightly increase load
    pass_p *= 1.0 - 0.01 * max(0, n_sub - 5)
    pass_p = max(0.03, min(0.97, pass_p))
    fail_p = 1.0 - pass_p

    predicted_gpa = round(3.2 + weighted * 6.6, 2)
    predicted_gpa = max(2.0, min(10.0, predicted_gpa))
    category = category_from_gpa(predicted_gpa)
    risk = risk_from_pass_prob(pass_p)

    return {
        "predictedPerformance": category,
        "predictedGPA": predicted_gpa,
        "passProbability": round(pass_p * 100, 1),
        "failProbability": round(fail_p * 100, 1),
        "riskLevel": risk,
        "score": round(weighted, 3),
        "method": "Weighted logistic mapping of attendance, study hours, internals, assignments, and prior GPA.",
    }


def student_prediction(student: dict) -> dict[str, Any]:
    avg = average_marks(student)
    prev_pct = student.get("previousSemesterPct") or (student.get("previousGPA", 0) * 10)
    result = predict_performance(
        {
            "attendance": student.get("attendance", 0),
            "studyHours": student.get("studyHours", 0),
            "internalMarks": student.get("internalMarks", 0),
            "assignmentMarks": student.get("assignmentMarks", 0),
            "previousGPA": student.get("previousGPA", 0),
            "previousSemesterPct": prev_pct,
            "numberOfSubjects": len(student.get("subjectMarks") or SUBJECTS),
        }
    )
    result["studentId"] = student.get("studentId")
    result["name"] = student.get("name")
    result["attendance"] = student.get("attendance")
    result["currentGPA"] = student.get("currentGPA")
    result["averageMarks"] = round(avg, 2)
    result["category"] = category_from_gpa(student.get("currentGPA", 0))
    return result


def conditional_probability(students: list[dict]) -> dict[str, Any]:
    n = len(students) or 1
    high_att = [s for s in students if s.get("attendance", 0) >= HIGH_ATTENDANCE]
    high_perf = [s for s in students if s.get("currentGPA", 0) >= HIGH_GPA]
    both = [s for s in high_att if s.get("currentGPA", 0) >= HIGH_GPA]
    p_b = len(high_att) / n
    p_a_and_b = len(both) / n
    p_cond = (p_a_and_b / p_b) if p_b > 0 else 0.0
    return {
        "eventA": "High Performance (GPA ≥ 6.5, Good or Excellent)",
        "eventB": "High Attendance (≥ 75%)",
        "pA": round(len(high_perf) / n, 4),
        "pB": round(p_b, 4),
        "pAandB": round(p_a_and_b, 4),
        "probability": round(p_cond, 4),
        "percent": round(p_cond * 100, 2),
        "formula": "P(A|B) = P(A ∩ B) / P(B)",
        "interpretation": (
            f"{round(p_cond * 100, 1)}% probability of high performance given attendance above 75%."
        ),
        "nHighAttendance": len(high_att),
        "nBoth": len(both),
        "n": n,
    }


def bayes_at_risk(students: list[dict], att_th: float, hours_th: float) -> dict[str, Any]:
    n = len(students) or 1
    at_risk = [s for s in students if category_from_gpa(s.get("currentGPA", 0)) == "At Risk"]
    def has_factors(s):
        return s.get("attendance", 100) < att_th and s.get("studyHours", 10) < hours_th

    with_factors = [s for s in students if has_factors(s)]
    at_risk_with_factors = [s for s in at_risk if has_factors(s)]

    prior = len(at_risk) / n
    evidence = len(with_factors) / n
    likelihood = (len(at_risk_with_factors) / len(at_risk)) if at_risk else 0.0
    posterior = (likelihood * prior / evidence) if evidence > 0 else 0.0

    return {
        "eventA": "Student is At Risk",
        "eventB": f"Attendance < {att_th}% and study hours < {hours_th}",
        "prior": round(prior, 4),
        "likelihood": round(likelihood, 4),
        "evidence": round(evidence, 4),
        "posterior": round(posterior, 4),
        "posteriorPercent": round(posterior * 100, 2),
        "formula": "P(A|B) = P(B|A) P(A) / P(B)",
        "counts": {
            "n": n,
            "atRisk": len(at_risk),
            "withFactors": len(with_factors),
            "atRiskWithFactors": len(at_risk_with_factors),
        },
    }


def normal_analysis(students: list[dict], parameter: str, target: float, subject: str | None) -> dict[str, Any]:
    data = _series(students, "subject" if parameter == "subjectMarks" else parameter, subject)
    if data.size < 2:
        return {"error": "Not enough data"}
    mean = float(np.mean(data))
    std = float(np.std(data, ddof=1))
    z = (target - mean) / std if std else 0.0
    
    def normal_cdf(x, mu, sigma):
        if sigma == 0: return 1.0 if x >= mu else 0.0
        return 0.5 * (1 + math.erf((x - mu) / (sigma * math.sqrt(2))))
        
    def normal_pdf(x, mu, sigma):
        if sigma == 0: return 0.0
        return math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * math.sqrt(2 * math.pi))

    p_below = float(normal_cdf(target, mean, std))
    p_above = float(1.0 - p_below)
    xs = np.linspace(mean - 4 * std, mean + 4 * std, 80)
    ys = [normal_pdf(x, mean, std) for x in xs]
    
    return {
        "mean": round(mean, 2),
        "standardDeviation": round(std, 2),
        "targetScore": target,
        "zScore": round(float(z), 3),
        "probabilityAbove": round(p_above * 100, 2),
        "probabilityBelow": round(p_below * 100, 2),
        "curve": {"x": [round(float(x), 2) for x in xs], "y": [round(float(y), 5) for y in ys]},
        "formula": "Z = (X − μ) / σ ; P(X > t) = 1 − Φ(Z)",
    }


def binomial_probability(n: int, p: float, k: int) -> dict[str, Any]:
    k = min(k, n)
    
    def binom_pmf(k_val, n_val, p_val):
        if k_val < 0 or k_val > n_val: return 0.0
        return math.comb(n_val, k_val) * (p_val ** k_val) * ((1 - p_val) ** (n_val - k_val))
        
    pmf = float(binom_pmf(k, n, p))
    cdf = float(sum(binom_pmf(i, n, p) for i in range(k + 1)))
    sf = float(sum(binom_pmf(i, n, p) for i in range(k, n + 1)))  # P(X >= k)
    xs = list(range(n + 1))
    ys = [float(binom_pmf(i, n, p)) for i in xs]
    
    return {
        "n": n,
        "p": p,
        "k": k,
        "probabilityExact": round(pmf, 6),
        "probabilityAtMost": round(cdf, 6),
        "probabilityAtLeast": round(sf, 6),
        "formula": "P(X = k) = C(n,k) p^k (1-p)^{n-k}",
        "interpretation": f"Probability of passing exactly {k} of {n} subjects is {round(pmf * 100, 2)}%.",
        "chart": {"x": xs, "y": [round(y, 5) for y in ys]},
    }


def recommendations_for(student: dict, pred: dict) -> list[dict]:
    recs = []
    att = student.get("attendance", 100)
    hours = student.get("studyHours", 8)
    marks = student.get("subjectMarks") or {}
    pass_p = pred.get("passProbability", 100)

    if att < 75:
        recs.append(
            {
                "issue": "Low attendance",
                "evidence": f"Attendance is {att}%, below the 75% threshold associated with higher pass probability.",
                "recommendation": "Improve attendance and maintain at least 75–80% attendance.",
                "priority": "High" if att < 60 else "Medium",
            }
        )
    if hours < 2:
        recs.append(
            {
                "issue": "Insufficient study hours",
                "evidence": f"Daily study time is {hours} hours.",
                "recommendation": "Increase daily study time and follow a structured study schedule.",
                "priority": "High",
            }
        )
    elif hours < 3.5:
        recs.append(
            {
                "issue": "Study hours below recommended range",
                "evidence": f"Daily study time is {hours} hours.",
                "recommendation": "Aim for 4–6 focused study hours with weekly revision.",
                "priority": "Medium",
            }
        )
    math_m = marks.get("Mathematics")
    if math_m is not None and math_m < 60:
        recs.append(
            {
                "issue": "Weak mathematics performance",
                "evidence": f"Mathematics marks are {math_m}%.",
                "recommendation": "Practice mathematics problems regularly and focus on weak topics.",
                "priority": "High" if math_m < 45 else "Medium",
            }
        )
    for sub, val in marks.items():
        if sub != "Mathematics" and val < 50:
            recs.append(
                {
                    "issue": f"Low {sub} marks",
                    "evidence": f"{sub} score is {val}%.",
                    "recommendation": f"Schedule targeted practice for {sub} and request faculty support.",
                    "priority": "High",
                }
            )
    if pass_p < 50:
        recs.append(
            {
                "issue": "Low pass probability",
                "evidence": f"Modelled pass probability is {pass_p}%.",
                "recommendation": "Immediate academic intervention is recommended.",
                "priority": "Critical",
            }
        )
    if student.get("assignmentMarks", 100) < 55:
        recs.append(
            {
                "issue": "Assignment performance",
                "evidence": f"Assignment marks are {student.get('assignmentMarks')}%.",
                "recommendation": "Complete pending assignments and seek feedback before the next submission.",
                "priority": "Medium",
            }
        )
    if not recs:
        recs.append(
            {
                "issue": "Performance on track",
                "evidence": f"Attendance {att}%, pass probability {pass_p}%.",
                "recommendation": "Maintain current study habits and continue periodic self-assessment.",
                "priority": "Low",
            }
        )
    return recs


def dashboard_summary(students: list[dict]) -> dict[str, Any]:
    if not students:
        return {
            "totalStudents": 0,
            "averageMarks": 0,
            "averageAttendance": 0,
            "passProbability": 0,
            "studentsAtRisk": 0,
            "predictionAccuracy": 0,
        }
    avgs = [average_marks(s) for s in students]
    atts = [s.get("attendance", 0) for s in students]
    preds = [student_prediction(s) for s in students]
    at_risk = sum(1 for p in preds if p["riskLevel"] == "HIGH" or p["category"] == "At Risk")
    # Accuracy: predicted category vs observed GPA category
    match = sum(1 for p in preds if p["predictedPerformance"] == p["category"])
    return {
        "totalStudents": len(students),
        "averageMarks": round(float(np.mean(avgs)), 2),
        "averageAttendance": round(float(np.mean(atts)), 2),
        "passProbability": round(float(np.mean([p["passProbability"] for p in preds])), 1),
        "studentsAtRisk": at_risk,
        "predictionAccuracy": round(100 * match / len(preds), 1),
        "averageGPA": round(float(np.mean([s.get("currentGPA", 0) for s in students])), 2),
    }


def dashboard_charts(students: list[dict]) -> dict[str, Any]:
    dist = Counter(category_from_gpa(s.get("currentGPA", 0)) for s in students)
    order = ["Excellent", "Good", "Average", "At Risk"]
    performance = [{"label": k, "count": dist.get(k, 0)} for k in order]

    scatter_att = [
        {
            "x": s.get("attendance"),
            "y": round(average_marks(s), 2),
            "name": s.get("name"),
            "id": s.get("studentId"),
        }
        for s in students
    ]
    scatter_hours = [
        {
            "x": s.get("studyHours"),
            "y": round(average_marks(s), 2),
            "name": s.get("name"),
            "id": s.get("studentId"),
        }
        for s in students
    ]
    subject_avgs = []
    for sub in SUBJECTS:
        vals = [s.get("subjectMarks", {}).get(sub) for s in students if s.get("subjectMarks", {}).get(sub) is not None]
        subject_avgs.append({"subject": sub, "average": round(float(np.mean(vals)), 2) if vals else 0})

    by_sem: dict[int, list[float]] = {}
    for s in students:
        by_sem.setdefault(int(s.get("semester", 1)), []).append(average_marks(s))
    trend = [{"semester": f"Sem {k}", "average": round(float(np.mean(v)), 2)} for k, v in sorted(by_sem.items())]

    return {
        "performanceDistribution": performance,
        "attendanceVsMarks": scatter_att,
        "studyHoursVsPerformance": scatter_hours,
        "subjectPerformance": subject_avgs,
        "performanceTrend": trend,
    }

def monte_carlo_simulation(body: dict, iterations: int = 1000) -> dict[str, Any]:
    att_mean = body.get("attendance", 80)
    att_std = body.get("attendanceStd", 5)
    hours_mean = body.get("studyHours", 4)
    hours_std = body.get("studyHoursStd", 1)
    
    internal = body.get("internalMarks", 50)
    assign = body.get("assignmentMarks", 50)
    gpa = body.get("previousGPA", 5)
    prev_pct = body.get("previousSemesterPct", 50)
    n_sub = body.get("numberOfSubjects", 5)
    
    results = []
    # Seed for reproducibility
    np.random.seed(42)
    
    for _ in range(iterations):
        att_sim = max(0, min(100, np.random.normal(att_mean, att_std)))
        hours_sim = max(0, min(24, np.random.normal(hours_mean, hours_std)))
        
        sim_body = {
            "attendance": att_sim,
            "studyHours": hours_sim,
            "internalMarks": internal,
            "assignmentMarks": assign,
            "previousGPA": gpa,
            "previousSemesterPct": prev_pct,
            "numberOfSubjects": n_sub
        }
        pred = predict_performance(sim_body)
        results.append(pred["predictedGPA"])
        
    results = np.array(results)
    mean_gpa = float(np.mean(results))
    std_gpa = float(np.std(results))
    percentile_5 = float(np.percentile(results, 5))
    percentile_95 = float(np.percentile(results, 95))
    
    hist_counts, hist_bins = np.histogram(results, bins=20)
    
    return {
        "iterations": iterations,
        "meanGPA": round(mean_gpa, 2),
        "stdGPA": round(std_gpa, 2),
        "confidenceInterval": {
            "lower90": round(percentile_5, 2),
            "upper90": round(percentile_95, 2)
        },
        "histogram": {
            "bins": [round(float(b), 2) for b in hist_bins[:-1]],
            "counts": [int(c) for c in hist_counts]
        },
        "method": f"Monte Carlo simulation with {iterations} iterations drawing from Normal distributions."
    }
