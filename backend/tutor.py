from google import genai
from dotenv import load_dotenv
from typing import List, Dict
import os, prompts, json
from fastapi import HTTPException

class Tutor:
    """The German Tutor class encapsulating LLM conversation logic"""

    def __init__(self):
        load_dotenv()
        self._apikey = os.getenv('GEMINI_API_KEY')
        self._client = genai.Client(api_key=self._apikey)
        self.chat_model = 'gemini-2.5-flash-lite'
        self.dict_model = 'gemini-2.5-flash-lite'
        self.verb_model = 'gemini-2.5-pro'
        self.system_prompt = prompts.SYSTEM

    def get_sample_sentence(self) -> str:
        """Use Gemini to generate a sample sentence in English"""
        prompt = self.system_prompt + "\n" + prompts.SAMPLE_SENTENCE
        response = self._client.models.generate_content(
            model=self.chat_model, contents=prompt
        )
        return response.text
    
    def check_translation(self, translation: str) -> str:
        """Use Gemini to assess user's translation of sample sentence"""
        prompt = self.system_prompt + "\n" + prompts.CHECK_SENTENCE + "\n" + translation
        response = self._client.models.generate_content(
            model=self.chat_model, contents=prompt
        )
        return response.text

    def look_up(self, expression: str) -> List[Dict]:
        """Use Gemini to look up a word/phrase in an English-German dictionary"""
        prompt = prompts.DICTIONARY + "\n" + expression
        response = self._client.models.generate_content(
            model=self.dict_model,
            contents=prompt,
            config={ 'response_mime_type': 'application/json' }
        )
        try:
            output = json.loads(response.text)
        except json.JSONDecodeError as e:
            raise ValueError("Failed to parse dictionary response from LLM as JSON.") from e
        return output
    
    def conjugate(self, verb: str) -> Dict[str, str]:
        """Use Gemini to look up conjugation forms in the Present Tense for a given verb"""
        prompt = prompts.CONJUGATION + "\n" + verb
        response = self._client.models.generate_content(
            model = self.verb_model,
            contents=prompt,
            config={ 'response_mime_type': 'application/json' }
        )

        try:
            verb_forms = json.loads(response.text)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail="Failed to parse LLM's response into JSON")
        
        if not verb_forms or len(verb_forms) == 0:
            raise HTTPException(status_code=400, detail="Invalid verb provided by user")
        
        return verb_forms

    




