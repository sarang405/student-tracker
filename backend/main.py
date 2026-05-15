from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import aiosqlite
from database import init_db, get_db
from auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    decode_token, get_current_user
)
from schemas import (
    RegisterRequest, LoginRequest, RefreshRequest,
    ActivityCreate, ActivityUpdate
)
from typing import Optional

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="Student Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ─────────────────────────────────────────────────

@app.post("/auth/register", status_code=201)
async def register(body: RegisterRequest, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        (body.username, body.email)
    ) as cursor:
        if await cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already exists")

    hashed = hash_password(body.password)
    await db.execute(
        "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)",
        (body.username, body.email, hashed)
    )
    await db.commit()
    return {"message": "Registered successfully"}

@app.post("/auth/login")
async def login(body: LoginRequest, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT * FROM users WHERE username = ?", (body.username,)
    ) as cursor:
        user = await cursor.fetchone()

    if not user or not verify_password(body.password, dict(user)["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = dict(user)
    access_token = create_access_token({"sub": str(user["id"])})
    refresh_token = create_refresh_token({"sub": str(user["id"])})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {"id": user["id"], "username": user["username"], "email": user["email"]}
    }

@app.post("/auth/refresh")
async def refresh(body: RefreshRequest, db: aiosqlite.Connection = Depends(get_db)):
    payload = decode_token(body.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    async with db.execute(
        "SELECT * FROM users WHERE id = ?", (payload["sub"],)
    ) as cursor:
        user = await cursor.fetchone()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    new_access = create_access_token({"sub": payload["sub"]})
    return {"access_token": new_access, "token_type": "bearer"}

@app.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"]
    }

# ── Activities ───────────────────────────────────────────

@app.post("/activities", status_code=201)
async def create_activity(
    body: ActivityCreate,
    db: aiosqlite.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    await db.execute(
        "INSERT INTO activities (student_id, student_name, activity, hours, date, user_id) VALUES (?,?,?,?,?,?)",
        (body.student_id, body.student_name, body.activity, body.hours, body.date, current_user["id"])
    )
    await db.commit()
    return {"message": "Activity added"}

@app.get("/activities")
async def get_activities(
    search: Optional[str] = Query(None),
    student_id: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: aiosqlite.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    conditions = ["user_id = ?"]
    params = [current_user["id"]]

    if search:
        conditions.append("(student_name LIKE ? OR activity LIKE ?)")
        params += [f"%{search}%", f"%{search}%"]
    if student_id:
        conditions.append("student_id = ?")
        params.append(student_id)
    if date:
        conditions.append("date = ?")
        params.append(date)

    where = " AND ".join(conditions)
    offset = (page - 1) * limit

    async with db.execute(
        f"SELECT COUNT(*) as total FROM activities WHERE {where}", params
    ) as cursor:
        total = (await cursor.fetchone())["total"]

    async with db.execute(
        f"SELECT * FROM activities WHERE {where} ORDER BY created_at DESC LIMIT ? OFFSET ?",
        params + [limit, offset]
    ) as cursor:
        rows = await cursor.fetchall()

    return {
        "data": [dict(r) for r in rows],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": -(-total // limit)
    }

@app.put("/activities/{activity_id}")
async def update_activity(
    activity_id: int,
    body: ActivityUpdate,
    db: aiosqlite.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    async with db.execute(
        "SELECT * FROM activities WHERE id = ? AND user_id = ?",
        (activity_id, current_user["id"])
    ) as cursor:
        row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Activity not found")

    existing = dict(row)
    updated = {
        "student_id": body.student_id or existing["student_id"],
        "student_name": body.student_name or existing["student_name"],
        "activity": body.activity or existing["activity"],
        "hours": body.hours if body.hours is not None else existing["hours"],
        "date": body.date or existing["date"],
    }
    await db.execute(
        "UPDATE activities SET student_id=?, student_name=?, activity=?, hours=?, date=? WHERE id=?",
        (*updated.values(), activity_id)
    )
    await db.commit()
    return {"message": "Activity updated"}

@app.delete("/activities/{activity_id}")
async def delete_activity(
    activity_id: int,
    db: aiosqlite.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    async with db.execute(
        "SELECT id FROM activities WHERE id = ? AND user_id = ?",
        (activity_id, current_user["id"])
    ) as cursor:
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Activity not found")

    await db.execute("DELETE FROM activities WHERE id = ?", (activity_id,))
    await db.commit()
    return {"message": "Activity deleted"}

@app.get("/summary")
async def get_summary(
    db: aiosqlite.Connection = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    uid = current_user["id"]

    async with db.execute(
        "SELECT COUNT(*) as total FROM activities WHERE user_id = ?", (uid,)
    ) as c:
        total_entries = (await c.fetchone())["total"]

    async with db.execute(
        "SELECT COALESCE(SUM(hours), 0) as total FROM activities WHERE user_id = ?", (uid,)
    ) as c:
        total_hours = (await c.fetchone())["total"]

    async with db.execute(
        """SELECT student_name, SUM(hours) as total_hours
           FROM activities WHERE user_id = ?
           GROUP BY student_name ORDER BY total_hours DESC LIMIT 1""",
        (uid,)
    ) as c:
        top = await c.fetchone()
        top_student = dict(top) if top else None

    async with db.execute(
        """SELECT date, SUM(hours) as total_hours
           FROM activities WHERE user_id = ?
           GROUP BY date ORDER BY date ASC""",
        (uid,)
    ) as c:
        hours_by_date = [dict(r) for r in await c.fetchall()]

    return {
        "total_entries": total_entries,
        "total_hours": round(total_hours, 2),
        "top_student": top_student,
        "hours_by_date": hours_by_date
    }