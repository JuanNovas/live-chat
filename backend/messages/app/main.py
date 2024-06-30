from fastapi import FastAPI
from api.endpoints import send, get_messages

app = FastAPI()

app.include_router(send.send_router, prefix="/message")
app.include_router(get_messages.get_messages_router, prefix="/message")
