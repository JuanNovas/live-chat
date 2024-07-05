from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from bson.json_util import dumps
from core.security import verify_token
from core.database import db

get_conversation_router = APIRouter()

@get_conversation_router.get("/get_conversation")
async def get_conversation(receiver: str, credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    token = credentials.credentials
    if not token:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        user = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
    
    conversation = db.messages.find({ "$or": [{"user" : user, "receiver" : receiver}, {"user" : receiver, "receiver" : user}]})
    clean_conversation = []

    for doc in conversation:
        doc['_id'] = str(doc['_id'])
        clean_conversation.append(doc)

    return {"conversation" : list(clean_conversation)}
