from core.database import db
from bson.json_util import dumps

class User:
    collection = db.users

    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password

    def save(self):
        self.collection.insert_one(self.__dict__)
        
    @classmethod
    def get_user(cls, username):
        return cls.collection.find_one({"username" : username})