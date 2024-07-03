from pydantic import BaseModel

class ContactSchema(BaseModel):
    contact : str