from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from app.auth import create_token, get_current_user, hash_password, verify_password
from app.db import get_db
from app.models import ForgotBody, LoginBody, ProfileBody, RegisterBody

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
async def register(body: RegisterBody):
    db = get_db()
    if await db.users.find_one({"email": body.email.lower()}):
        raise HTTPException(400, "Email already registered")
    doc = {
        "name": body.name.strip(),
        "email": body.email.lower(),
        "password": hash_password(body.password),
        "role": body.role,
        "createdAt": datetime.now(timezone.utc),
    }
    result = await db.users.insert_one(doc)
    token = create_token(str(result.inserted_id), doc["email"], doc["role"])
    return {
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "name": doc["name"],
            "email": doc["email"],
            "role": doc["role"],
        },
    }


@router.post("/login")
async def login(body: LoginBody):
    db = get_db()
    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_token(str(user["_id"]), user["email"], user["role"])
    return {
        "token": token,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"], "role": user["role"]},
    }


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}


@router.post("/forgot-password")
async def forgot(body: ForgotBody):
    email = body.email.lower()
    user = await get_db().users.find_one({"email": email})
    msg = (
        "If an account exists, a reset link would be sent. "
        "This demo has no email server — use demo password EduWise@123."
    )
    return JSONResponse({"message": msg, "found": bool(user)})


@router.post("/profile")
async def update_profile(body: ProfileBody, user=Depends(get_current_user)):
    db = get_db()
    updates = {}
    if body.name:
        updates["name"] = body.name.strip()
    if body.password:
        if len(body.password) < 6:
            raise HTTPException(400, "Password must be at least 6 characters")
        updates["password"] = hash_password(body.password)
    if updates:
        await db.users.update_one({"email": user["email"]}, {"$set": updates})
    fresh = await db.users.find_one({"email": user["email"]})
    return {"id": str(fresh["_id"]), "name": fresh["name"], "email": fresh["email"], "role": fresh["role"]}
