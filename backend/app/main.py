from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import close_db, connect_db
from app.routers import auth as auth_router
from app.routers.analytics import router as analytics_router
from app.routers.students import router as students_router
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await seed_if_empty()
    yield
    await close_db()


app = FastAPI(
    title="EduWise Academic Intelligence",
    description="Statistical analysis and probability-based prediction of student academic performance.",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(students_router)
app.include_router(analytics_router)


@app.get("/api/health")
async def health():
    return {"ok": True, "service": "eduwise"}
