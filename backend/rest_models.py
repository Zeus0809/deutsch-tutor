from pydantic import BaseModel

class TranslationRequest(BaseModel):
    translation: str

class DictionaryRequest(BaseModel):
    expression: str

class ConjugationRequest(BaseModel):
    verb: str

class NounRequest(BaseModel):
    noun: str
