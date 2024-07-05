import requests
import json
from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends, HTTPException, Request, Cookie
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.security import verify_token
from core.database import db
from core.manager import manager


auth_scheme = HTTPBearer()
connect_router = APIRouter()
    
    
@connect_router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str, token: str):
    try:
        user = verify_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    user_id = client_id
    
    conversation = db.contacts.find_one({"users": {"$all": [user_id, user]}})
    if not conversation:
        await websocket.close(code=1008)
        return
    
    conversation_id = str(conversation["_id"])
    await manager.connect(websocket, conversation_id)

    try:
        while True:
            original_data = await websocket.receive_text()
            data = json.loads(original_data)
            response = requests.post("http://message-service:8000/send", json={"receiver": user_id, "body": data["body"]}, headers={"Authorization": f"Bearer {token}"})
            if response.status_code == 200:
                await manager.broadcast(f"{original_data}", conversation_id)
            else:
                await websocket.send_text("Failed to send message")
    except WebSocketDisconnect as e:
        manager.disconnect(websocket, conversation_id)
        print(e)
    except Exception as e:
        print(f"Unexpected error: {e}")
        await websocket.close(code=1011)