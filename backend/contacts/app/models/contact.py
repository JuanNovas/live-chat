from core.database import db
from bson.json_util import dumps

class Contact:
    collection = db.contacts

    def __init__(self, users: list):
        self.users = users
        
    def save(self):
        self.collection.insert_one(self.__dict__)
        
    @classmethod
    def get_all(cls, user : str):
        return dumps(cls.collection.find({"users" : user}))