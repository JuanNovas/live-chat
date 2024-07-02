from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from os import getenv

load_dotenv()
KEY = getenv("KEY")
ALGORITHM = getenv("ALGORITHM")


def create_token(data: dict):
    token_data = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    token_data.update({"exp": expire})
    new_jwt = jwt.encode(token_data, KEY, algorithm=ALGORITHM)
    return new_jwt