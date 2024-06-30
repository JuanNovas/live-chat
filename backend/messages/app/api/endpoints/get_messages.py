from fastapi import APIRouter
from models.message import Message

get_messages_router = APIRouter()

@get_messages_router.get("/get_messages")
async def get_messages():
    messages = Message.get_all()
    return [{"user_id": msg['user_id'], "body": msg['body']} for msg in messages]
