from fastapi import FastAPI
from api.endpoints import get_contacts, add_contact
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(get_contacts.get_contacts_router, prefix="")
app.include_router(add_contact.add_contact_router, prefix="")
