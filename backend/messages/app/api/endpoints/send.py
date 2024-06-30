from fastapi import APIRouter
from core.database import db

send_router = APIRouter()

@send_router.get("/send")
async def send(body : str):
    db.message.insert_one({"body" : body})
    print(body)
    return {"body" : body}
