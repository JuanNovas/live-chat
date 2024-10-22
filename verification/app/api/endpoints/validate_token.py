from fastapi import APIRouter
from schema.token import TokenSchema
from core.security import verify_token

get_user_router = APIRouter()

@get_user_router.post("/validate_token")
async def validate_token(token: TokenSchema):
    user = verify_token(token.token)
    return {"user": user}