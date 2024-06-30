from pydantic import BaseModel

class MessageSchema(BaseModel):
    user_id : int
    body : str

