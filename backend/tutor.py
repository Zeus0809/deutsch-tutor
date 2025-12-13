from google import genai
from dotenv import load_dotenv
import os, prompts

class Tutor:
    """The German Tutor class encapsulating LLM conversation logic"""

    def __init__(self):
        load_dotenv()
        self._apikey = os.getenv('GEMINI_API_KEY')
        self._client = genai.Client(api_key=self._apikey)
        self.model = 'gemini-2.5-pro'
        self.system_prompt = prompts.SYSTEM

    def get_sample_sentence(self) -> str:
        """Use Gemini to generate a sample sentence in English"""
        prompt = self.system_prompt + "\n" + prompts.SAMPLE_SENTENCE
        response = self._client.models.generate_content(
            model=self.model, contents=prompt
        )
        return response.text
    
    def check_translation(self, translation: str) -> str:
        """Use Gemini to assess user's translation of sample sentence"""
        prompt = self.system_prompt + "\n" + prompts.CHECK_SENTENCE + "\n" + translation
        response = self._client.models.generate_content(
            model=self.model, contents=prompt
        )
        return response.text




