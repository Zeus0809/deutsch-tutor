from pydantic import BaseModel

class TranslationRequest(BaseModel):
    translation: str


