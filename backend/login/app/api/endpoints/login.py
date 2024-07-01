from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from models.user import User
from datetime import datetime, timedelta
from core.config import pwd_context
from dotenv import load_dotenv
from os import getenv

load_dotenv()
KEY = getenv("KEY")
ALGORITHM = getenv("ALGORITHM")

login_router = APIRouter()

@login_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_token(
        data={"sub": user["username"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

def authenticate_user(username: str, password: str):
    user = User.get_user(username=username)
    if not user:
        return False
    if not pwd_context.verify(password, user["password"]):
        return False
    return user

def create_token(data: dict):
    token_data = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    token_data.update({"exp": expire})
    new_jwt = jwt.encode(token_data, KEY, algorithm=ALGORITHM)
    return new_jwt
