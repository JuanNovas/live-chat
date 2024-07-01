from fastapi import FastAPI
from api.endpoints import register, login

app = FastAPI()

app.include_router(register.register_router, prefix="/register")
app.include_router(login.login_router, prefix="/login")