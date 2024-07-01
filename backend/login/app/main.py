from fastapi import FastAPI
from api.endpoints import register

app = FastAPI()

app.include_router(register.register_router, prefix="/register")