from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from schemas.user import UserSchema
from models.user import User
from core.database import db

register_router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@register_router.post("/register")
async def register(user: UserSchema):
    user.password = pwd_context.hash(user.password)
    exist_user = User.get_user(username=user.username)
    if exist_user:
        raise HTTPException(detail="Username already registered", status_code=400)
    new_user = User(username=user.username, password=user.password)
    new_user.save()
    return {"status" : "ok"}