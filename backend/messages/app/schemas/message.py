from pydantic import BaseModel

class MessageSchema(BaseModel):
    receiver : str
    body : str

