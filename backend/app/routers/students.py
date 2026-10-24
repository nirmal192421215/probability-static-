from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.db import get_db
from app.models import StudentBody, serialize
from app.stats_engine import (
    average_marks,
    category_from_gpa,
    recommendations_for,
    student_prediction,
)

router = APIRouter(prefix="/api/students", tags=["students"])


def can_mutate(user) -> bool:
    return user.get("role") in ("Administrator", "Faculty")


@router.get("")
async def list_students(
    q: str = "",
    status: str = "",
    department: str = "",
    semester: int | None = None,
    user=Depends(get_current_user),
):
    db = get_db()
    filt: dict = {}
    if q:
        filt["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"studentId": {"$regex": q, "$options": "i"}},
        ]
    if department:
        filt["department"] = department
    if semester:
        filt["semester"] = semester
    docs = await db.students.find(filt).sort("studentId", 1).to_list(500)
    rows = []
    for d in docs:
        pred = student_prediction(d)
        cat = category_from_gpa(d.get("currentGPA", 0))
        if status and cat != status and pred["riskLevel"] != status:
            continue
        item = serialize(d)
        item["status"] = cat
        item["averageMarks"] = round(average_marks(d), 2)
        item["passProbability"] = pred["passProbability"]
        item["riskLevel"] = pred["riskLevel"]
        rows.append(item)
    return rows


@router.get("/{student_id}/profile")
async def student_profile(student_id: str, user=Depends(get_current_user)):
    return await get_student(student_id, user)


@router.get("/{student_id}")
async def get_student(student_id: str, user=Depends(get_current_user)):
    d = await get_db().students.find_one({"studentId": student_id})
    if not d:
        raise HTTPException(404, "Student not found")
    pred = student_prediction(d)
    recs = recommendations_for(d, pred)
    item = serialize(d)
    item["status"] = category_from_gpa(d.get("currentGPA", 0))
    item["averageMarks"] = round(average_marks(d), 2)
    item["prediction"] = pred
    item["recommendations"] = recs
    marks = list((d.get("subjectMarks") or {}).values())
    if marks:
        import numpy as np

        arr = np.array(marks, dtype=float)
        item["statisticalSummary"] = {
            "mean": round(float(arr.mean()), 2),
            "median": round(float(np.median(arr)), 2),
            "standardDeviation": round(float(arr.std(ddof=1)), 2) if len(arr) > 1 else 0,
            "percentile": round(float((arr.mean() / 100) * 100), 1),
        }
        # percentile vs cohort
        all_docs = await get_db().students.find({}).to_list(500)
        cohort = [average_marks(s) for s in all_docs]
        pct = sum(1 for x in cohort if x <= average_marks(d)) / max(len(cohort), 1) * 100
        item["statisticalSummary"]["percentile"] = round(pct, 1)
    return item


@router.post("")
async def create_student(body: StudentBody, user=Depends(get_current_user)):
    if not can_mutate(user):
        raise HTTPException(403, "Only faculty or administrators can add students")
    db = get_db()
    if await db.students.find_one({"studentId": body.studentId}):
        raise HTTPException(400, "Student ID already exists")
    doc = body.model_dump()
    doc["createdAt"] = datetime.now(timezone.utc)
    await db.students.insert_one(doc)
    pred = student_prediction(doc)
    await db.predictions.insert_one(
        {
            "studentId": doc["studentId"],
            "passProbability": pred["passProbability"],
            "failProbability": pred["failProbability"],
            "performanceCategory": pred["predictedPerformance"],
            "riskLevel": pred["riskLevel"],
            "createdAt": datetime.now(timezone.utc),
        }
    )
    recs = recommendations_for(doc, pred)
    if recs:
        await db.recommendations.insert_many(
            [{"studentId": doc["studentId"], **r, "createdAt": datetime.now(timezone.utc)} for r in recs]
        )
    return serialize(await db.students.find_one({"studentId": body.studentId}))


@router.put("/{student_id}")
async def update_student(student_id: str, body: StudentBody, user=Depends(get_current_user)):
    if not can_mutate(user):
        raise HTTPException(403, "Only faculty or administrators can edit students")
    db = get_db()
    existing = await db.students.find_one({"studentId": student_id})
    if not existing:
        raise HTTPException(404, "Student not found")
    doc = body.model_dump()
    if doc["studentId"] != student_id and await db.students.find_one({"studentId": doc["studentId"]}):
        raise HTTPException(400, "Student ID already exists")
    await db.students.update_one({"studentId": student_id}, {"$set": doc})
    return serialize(await db.students.find_one({"studentId": doc["studentId"]}))


@router.delete("/{student_id}")
async def delete_student(student_id: str, user=Depends(get_current_user)):
    if not can_mutate(user):
        raise HTTPException(403, "Only faculty or administrators can delete students")
    db = get_db()
    res = await db.students.delete_one({"studentId": student_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Student not found")
    await db.predictions.delete_many({"studentId": student_id})
    await db.recommendations.delete_many({"studentId": student_id})
    await db.analysis.delete_many({"studentId": student_id})
    return {"ok": True}
