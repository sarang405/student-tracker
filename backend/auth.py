from datetime import datetime,timedelta
from jose import JWTError,jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import aiosqlite
from database import get_db

SECRET_KEY = "supersecretkey_change_in_production_123"
ALGORITHM = "HS256"
ACCES_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
bearer_scheme = HTTPBearer()

def hash_password(password:str)-> str:
    return pwd_context.hash(password)

def verify_password(plain:str,hashed:str)-> str:
    return pwd_context.verify(plain, hashed)


def create_access_token(data:dict)-> str :
    to_encode = data.copy()
    to_encode["exp"] =datetime.utcnow()+ timedelta(minutes=ACCES_TOKEN_EXPIRE_MINUTES)
    to_encode["type"] = "access"
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode =data.copy()
    to_encode["exp"]=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode["type"] = "refresh"
    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

def decode_token(token:str) -> dict:
    try:
        return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNATHORIZED,
            detail="Invalid or Expired Token"
        )
    
async def get_current_user(
        credentials: HTTPAuthorizationCredentials =Depends(bearer_scheme),
        db:aiosqlite.Connection = Depends(get_db)
):
    payload =decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401,detail="Invalid token type")
    
    user_id=payload.get("sub")
    async with db.execute("SELECT * FROM users WHERE id = ?",(user_id,)) as cursor:
        user= await cursor.fetchone()

    if not user:
        raise HTTPException(status_code=401,datail="User not found")
    return dict (user)
