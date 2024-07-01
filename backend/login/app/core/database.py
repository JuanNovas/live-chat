from pymongo import MongoClient
from dotenv import load_dotenv
from os import getenv

load_dotenv()
uri = getenv("MONGODB_URI")
client = MongoClient(uri)
db = client.TEST_DATABASE