from datetime import datetime, timezone

from app.auth import hash_password
from app.db import get_db
from app.stats_engine import (
    recommendations_for,
    student_prediction,
)

DEMO_PASSWORD = "EduWise@123"

STUDENTS = [
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
]


async def seed_if_empty():
    db = get_db()
    if await db.users.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        hashed = hash_password(DEMO_PASSWORD)
        await db.users.insert_many(
            [
                {"name": "Admin User", "email": "admin@eduwise.local", "password": hashed, "role": "Administrator", "createdAt": now},
                {"name": "Faculty User", "email": "faculty@eduwise.local", "password": hashed, "role": "Faculty", "createdAt": now},
                {"name": "Student User", "email": "student@eduwise.local", "password": hashed, "role": "Student", "createdAt": now},
            ]
        )

    if await db.students.count_documents({}) == 0:
        now = datetime.now(timezone.utc)
        docs = [{**s, "createdAt": now} for s in STUDENTS]
        await db.students.insert_many(docs)

        preds = []
        recs = []
        analyses = []
        for s in STUDENTS:
            pred = student_prediction(s)
            preds.append(
                {
                    "studentId": s["studentId"],
                    "passProbability": pred["passProbability"],
                    "failProbability": pred["failProbability"],
                    "performanceCategory": pred["predictedPerformance"],
                    "riskLevel": pred["riskLevel"],
                    "createdAt": now,
                }
            )
            for r in recommendations_for(s, pred):
                recs.append({"studentId": s["studentId"], **r, "createdAt": now})
            analyses.append(
                {
                    "studentId": s["studentId"],
                    "mean": s["currentGPA"],
                    "median": s["currentGPA"],
                    "mode": s["currentGPA"],
                    "variance": None,
                    "standardDeviation": None,
                    "correlation": None,
                    "createdAt": now,
                }
            )
        if preds:
            await db.predictions.insert_many(preds)
        if recs:
            await db.recommendations.insert_many(recs)
        if analyses:
            await db.analysis.insert_many(analyses)
