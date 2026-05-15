from pydantic import BaseModel, field_validator
from typing import Optional

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v):
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("email")
    @classmethod
    def email_valid(cls, v):
        if "@" not in v or "." not in v:
            raise ValueError("Invalid email address")
        return v.lower()

class LoginRequest(BaseModel):
    username: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class ActivityCreate(BaseModel):
    student_id: str
    student_name: str
    activity: str
    hours: float
    date: str

    @field_validator("hours")
    @classmethod
    def hours_valid(cls, v):
        if v <= 0 or v > 24:
            raise ValueError("Hours must be between 0 and 24")
        return v

    @field_validator("student_id", "student_name", "activity", "date")
    @classmethod
    def not_empty(cls, v):
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v

class ActivityUpdate(BaseModel):
    student_id: Optional[str] = None
    student_name: Optional[str] = None
    activity: Optional[str] = None
    hours: Optional[float] = None
    date: Optional[str] = None