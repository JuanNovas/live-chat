from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from bson.json_util import dumps
from core.security import verify_token
from core.database import db
from models.contact import Contact

get_contacts_router = APIRouter()

@get_contacts_router.get("/get_contacts")
async def get_contacts(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        user = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
    
    contacts = Contact.get_all(user)

    return dumps(contacts)