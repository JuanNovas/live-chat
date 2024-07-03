from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from datetime import datetime
from schemas.message import MessageSchema
from models.message import Message
from core.security import verify_token
auth_scheme = HTTPBearer()
send_router = APIRouter()

@send_router.post("/send")
async def send_message(message: MessageSchema, credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        user = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    message_model = Message(user=user, body=message.body, receiver=message.receiver, timestamp=datetime.now())
    message_model.save()
    return {"status": "Message sent", "user": user}
