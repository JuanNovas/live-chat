from fastapi import FastAPI
from api.endpoints.send import send_router

app = FastAPI()

app.include_router(send_router, prefix="/message")
