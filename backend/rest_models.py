from pydantic import BaseModel

class TranslationRequest(BaseModel):
    translation: str

class DictionaryRequest(BaseModel):
    expression: str

