from fastapi import APIRouter
from core.database import db
from schemas.message import MessageSchema
from models.message import Message

send_router = APIRouter()

@send_router.post("/send")
async def send(message : MessageSchema):
    message_model = Message(user_id=message.user_id, body=message.body)
    message_model.save()
    return {"status" : "ok"}
