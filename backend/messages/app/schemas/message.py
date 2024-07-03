from pydantic import BaseModel

class MessageSchema(BaseModel):
    receiver : int
    body : str

