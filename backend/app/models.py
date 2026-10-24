from typing import Any

from pydantic import BaseModel, Field


class RegisterBody(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str
    password: str = Field(min_length=6, max_length=72)
    role: str = Field(pattern="^(Student|Faculty|Administrator)$")


class LoginBody(BaseModel):
    email: str
    password: str
    remember: bool = False


class ForgotBody(BaseModel):
    email: str


class ProfileBody(BaseModel):
    name: str | None = None
    password: str | None = None


class StudentBody(BaseModel):
    studentId: str
    name: str
    age: int = Field(ge=16, le=40)
    gender: str
    department: str = "Computer Science"
    semester: int = Field(ge=1, le=8)
    attendance: float = Field(ge=0, le=100)
    studyHours: float = Field(ge=0, le=16)
    internalMarks: float = Field(ge=0, le=100)
    assignmentMarks: float = Field(ge=0, le=100)
    previousGPA: float = Field(ge=0, le=10)
    currentGPA: float = Field(ge=0, le=10)
    previousSemesterPct: float = Field(ge=0, le=100, default=0)
    subjectMarks: dict[str, float]


class PredictBody(BaseModel):
    attendance: float = Field(ge=0, le=100)
    studyHours: float = Field(ge=0, le=16)
    internalMarks: float = Field(ge=0, le=100)
    assignmentMarks: float = Field(ge=0, le=100)
    previousGPA: float = Field(ge=0, le=10)
    previousSemesterPct: float = Field(ge=0, le=100)
    numberOfSubjects: int = Field(ge=1, le=12)
    studentId: str | None = None


class DescriptiveBody(BaseModel):
    dataset: str = "all"
    subject: str | None = None
    semester: int | None = None
    parameter: str = "currentGPA"


class CorrelationBody(BaseModel):
    pair: str = "attendance_marks"


class NormalBody(BaseModel):
    parameter: str = "averageMarks"
    targetScore: float = 80
    semester: int | None = None
    subject: str | None = None


class BinomialBody(BaseModel):
    n: int = Field(ge=1, le=20)
    p: float = Field(ge=0, le=1)
    k: int = Field(ge=0, le=20)


class BayesBody(BaseModel):
    attendanceThreshold: float = 75
    studyHoursThreshold: float = 3


class MonteCarloBody(BaseModel):
    attendance: float = Field(ge=0, le=100)
    attendanceStd: float = Field(ge=0, le=20, default=5.0)
    studyHours: float = Field(ge=0, le=24)
    studyHoursStd: float = Field(ge=0, le=5, default=1.0)
    internalMarks: float = Field(ge=0, le=100)
    assignmentMarks: float = Field(ge=0, le=100)
    previousGPA: float = Field(ge=0, le=10)
    previousSemesterPct: float = Field(ge=0, le=100)
    numberOfSubjects: int = Field(ge=1, le=12, default=5)
    iterations: int = Field(ge=100, le=10000, default=1000)

def serialize(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    if not doc:
        return None
    out = dict(doc)
    if "_id" in out:
        out["id"] = str(out.pop("_id"))
    return out
