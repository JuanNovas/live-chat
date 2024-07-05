from models.user import User
from core.config import pwd_context

def authenticate_user(username: str, password: str):
    user = User.get_user(username=username)
    if not user:
        return False
    if not pwd_context.verify(password, user["password"]):
        return False
    return user
