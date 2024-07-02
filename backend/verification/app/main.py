from fastapi import FastAPI
from api.endpoints import validate_token

app = FastAPI()

app.include_router(validate_token.validate_token, prefix="")