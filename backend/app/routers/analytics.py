from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response

from app.auth import get_current_user
from app.db import get_db
from app.models import BayesBody, BinomialBody, CorrelationBody, DescriptiveBody, NormalBody, PredictBody, MonteCarloBody
from app.pdf_report import build_student_pdf
from app.stats_engine import (
    bayes_at_risk,
    binomial_probability,
    conditional_probability,
    correlations,
    dashboard_charts,
    dashboard_summary,
    descriptive,
    filter_students,
    normal_analysis,
    predict_performance,
    recommendations_for,
    student_prediction,
    monte_carlo_simulation,
)

router = APIRouter(prefix="/api", tags=["analytics"])


async def all_students():
    return await get_db().students.find({}).sort("studentId", 1).to_list(1000)


@router.get("/dashboard/summary")
async def summary(user=Depends(get_current_user)):
    return dashboard_summary(await all_students())


@router.get("/dashboard/charts")
async def charts(user=Depends(get_current_user)):
    return dashboard_charts(await all_students())


@router.get("/dashboard/public-stats")
async def public_stats():
    students = await all_students()
    s = dashboard_summary(students)
    return s


@router.post("/analysis/descriptive")
async def desc(body: DescriptiveBody, user=Depends(get_current_user)):
    students = filter_students(await all_students(), body.semester, body.dataset)
    param = body.parameter
    subject = body.subject
    if param in ("Mathematics", "Statistics", "Computer Science", "English", "Physics"):
        subject = param
        param = "subjectMarks"
    result = descriptive(students, param, subject)
    db = get_db()
    await db.analysis.insert_one(
        {
            "studentId": "COHORT",
            "mean": result.get("mean"),
            "median": result.get("median"),
            "mode": result.get("mode"),
            "variance": result.get("variance"),
            "standardDeviation": result.get("standardDeviation"),
            "correlation": None,
            "createdAt": datetime.now(timezone.utc),
            "parameter": body.parameter,
        }
    )
    return result


@router.post("/analysis/correlation")
async def corr(body: CorrelationBody, user=Depends(get_current_user)):
    return {"pairs": correlations(await all_students())}


@router.post("/probability/conditional")
async def cond(user=Depends(get_current_user)):
    return conditional_probability(await all_students())


@router.post("/probability/bayes")
async def bayes(body: BayesBody, user=Depends(get_current_user)):
    return bayes_at_risk(await all_students(), body.attendanceThreshold, body.studyHoursThreshold)


@router.post("/probability/normal")
async def normal(body: NormalBody, user=Depends(get_current_user)):
    param = body.parameter
    subject = body.subject
    students = filter_students(await all_students(), body.semester)
    if param in ("Mathematics", "Statistics", "Computer Science", "English", "Physics"):
        subject = param
        param = "subjectMarks"
    return normal_analysis(students, param, body.targetScore, subject)


@router.post("/probability/binomial")
async def binomial(body: BinomialBody, user=Depends(get_current_user)):
    return binomial_probability(body.n, body.p, body.k)


@router.post("/predict")
async def predict(body: PredictBody, user=Depends(get_current_user)):
    result = predict_performance(body.model_dump())
    if body.studentId:
        await get_db().predictions.insert_one(
            {
                "studentId": body.studentId,
                "passProbability": result["passProbability"],
                "failProbability": result["failProbability"],
                "performanceCategory": result["predictedPerformance"],
                "riskLevel": result["riskLevel"],
                "createdAt": datetime.now(timezone.utc),
            }
        )
    return result


@router.post("/predict/monte-carlo")
async def monte_carlo(body: MonteCarloBody, user=Depends(get_current_user)):
    return monte_carlo_simulation(body.model_dump(), body.iterations)


@router.get("/risk")
async def risk(user=Depends(get_current_user)):
    students = await all_students()
    rows = [student_prediction(s) for s in students]
    n = len(rows) or 1
    low = sum(1 for r in rows if r["riskLevel"] == "LOW")
    med = sum(1 for r in rows if r["riskLevel"] == "MEDIUM")
    high = sum(1 for r in rows if r["riskLevel"] == "HIGH")
    return {
        "distribution": [
            {"level": "LOW", "count": low, "percent": round(100 * low / n, 1)},
            {"level": "MEDIUM", "count": med, "percent": round(100 * med / n, 1)},
            {"level": "HIGH", "count": high, "percent": round(100 * high / n, 1)},
        ],
        "students": rows,
    }


@router.get("/recommendations")
async def recs(studentId: str | None = None, user=Depends(get_current_user)):
    students = await all_students()
    if studentId:
        students = [s for s in students if s.get("studentId") == studentId]
        if not students:
            raise HTTPException(404, "Student not found")
    out = []
    for s in students:
        pred = student_prediction(s)
        for r in recommendations_for(s, pred):
            out.append({"studentId": s["studentId"], "name": s["name"], **r})
    return out


@router.get("/reports/{student_id}/pdf")
async def report_pdf(student_id: str, user=Depends(get_current_user)):
    db = get_db()
    student = await db.students.find_one({"studentId": student_id})
    if not student:
        raise HTTPException(404, "Student not found")
    students = await all_students()
    stats = descriptive(students, "averageMarks")
    pred = student_prediction(student)
    recs = recommendations_for(student, pred)
    cond = conditional_probability(students)
    bayes = bayes_at_risk(students, 75, 3)
    pdf = build_student_pdf(student, stats, pred, recs, cond, bayes)
    filename = f"EduWise_{student_id}_Report.pdf"
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/reports/{student_id}")
async def report_data(student_id: str, user=Depends(get_current_user)):
    db = get_db()
    student = await db.students.find_one({"studentId": student_id})
    if not student:
        raise HTTPException(404, "Student not found")
    students = await all_students()
    pred = student_prediction(student)
    student["_id"] = str(student["_id"])
    return {
        "student": student,
        "stats": descriptive(students, "averageMarks"),
        "prediction": pred,
        "recommendations": recommendations_for(student, pred),
        "conditional": conditional_probability(students),
        "bayes": bayes_at_risk(students, 75, 3),
        "correlations": correlations(students),
    }
