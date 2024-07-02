from fastapi import APIRouter
from core.security import verify_token

get_user_router = APIRouter()

@get_user_router.post("/validate_token")
async def validate_token(token: str):
    user = verify_token(token)
    return {"user": user}