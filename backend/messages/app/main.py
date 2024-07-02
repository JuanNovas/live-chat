from fastapi import FastAPI
from api.endpoints import send, get_messages
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(send.send_router, prefix="/message")
app.include_router(get_messages.get_messages_router, prefix="/message")
