import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri)
db = client.TEST_DATABASE