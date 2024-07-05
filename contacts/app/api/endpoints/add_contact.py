from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.contact import Contact
from schemas.contact import ContactSchema
from core.security import verify_token

auth_scheme = HTTPBearer()
add_contact_router = APIRouter()

@add_contact_router.post("/add_contact")
async def add_contact_message(contact: ContactSchema, credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        user = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

    new_contact = Contact(users=[user, contact.contact])
    new_contact.save()
    
    return {"status": "Contact save"}