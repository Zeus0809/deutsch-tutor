from pydantic import BaseModel

class ChatMessageRequest(BaseModel):
    user_message: str

class DictionaryRequest(BaseModel):
    expression: str

class ConjugationRequest(BaseModel):
    verb: str

class NounRequest(BaseModel):
    noun: str
