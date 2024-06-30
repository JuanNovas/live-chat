from core.database import db
from bson.json_util import dumps

class Message:
    collection = db.messages

    def __init__(self, user_id: int, body: str):
        self.user_id = user_id
        self.body = body

    def save(self):
        self.collection.insert_one(self.__dict__)
        
    @classmethod
    def get_all(cls):
        return dumps(cls.collection.find())