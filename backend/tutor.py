from google import genai
from dotenv import load_dotenv
from typing import List, Dict
import os, prompts, json
from fastapi import HTTPException
from utils import convert_audio_to_wav

class Tutor:
    """The German Tutor class encapsulating LLM conversation logic"""

    def __init__(self):
        load_dotenv()
        self._apikey = os.getenv('GEMINI_API_KEY')
        self._client = genai.Client(api_key=self._apikey)
        self.chat_model = 'gemini-2.5-flash-lite'
        self.dict_model = 'gemini-2.5-flash-lite'
        self.verb_model = 'gemini-2.5-flash-lite'
        self.noun_model = 'gemini-2.5-flash-lite'
        self.tts_model = 'gemini-2.5-flash-preview-tts'
        self.conversation = None # Gemini chat context

    def _get_topics(self) -> str:
        """Use Gemini to generate a list of 50 topics for sentences."""
        response = self._client.models.generate_content(
            model=self.chat_model,
            contents=prompts.TOPICS,
            config={'temperature': 1.0}
        )
        return response.text

    def start_conversation(self) -> str:
        """Use Gemini to create a Chat instance and return the first sample sentence"""
        topics = self._get_topics()
        # create a chat object to maintain conversation context
        self.conversation = self._client.chats.create(
            model = self.chat_model,
            config = {
                'system_instruction': prompts.get_system_prompt(topics), # embed topics
                'temperature': 0.75
            },
        )
        response = self.conversation.send_message("Let's begin the exercise.")
        return response.text
    
    def send_user_message(self, user_message: str) -> str:
        """
        Send subsequent user messages to Gemini, maintaining chat context.
        While most user messages are expected to be sentence translations,
        sometimes they might be follow-up questions or other queries.
        """
        if not self.conversation:
            # in case chat context is lost
            raise HTTPException(status_code=404, detail="No active conversation. Call start_conversation first.")
        response = self.conversation.send_message(user_message)
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
            print(e)
            raise HTTPException(status_code=500, detail="Failed to parse LLM's response into JSON")
        
        if not output or len(output) == 0:
            raise HTTPException(status_code=400, detail="Invalid expression provided by user")
        
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
            print(e)
            raise HTTPException(status_code=500, detail="Failed to parse LLM's response into JSON")
        
        if not verb_forms or len(verb_forms) == 0:
            raise HTTPException(status_code=400, detail="Invalid verb provided by user")
        
        return verb_forms
    
    def get_noun_details(self, noun: str) -> Dict[str, str]:
        """Use Gemini to look up the gender and plural form of a given noun"""
        prompt = prompts.NOUN + "\n" + noun
        response = self._client.models.generate_content(
            model = self.noun_model,
            contents=prompt,
            config={ 'response_mime_type': 'application/json' }
        )

        try:
            noun_details = json.loads(response.text)
        except json.JSONDecodeError as e:
            print(e)
            raise HTTPException(status_code=500, detail="Failed to parse LLM's response into JSON")
        
        if not noun_details or len(noun_details) == 0:
            raise HTTPException(status_code=400, detail="Invalid noun provided by user")
        
        return noun_details

    def pronounce(self, text: str) -> bytes:
        """Use Gemini TTS to get an audio blob of given text"""
        prompt = prompts.PRONUNCIATION + "\n" + text
        response = self._client.models.generate_content(
            model=self.tts_model,
            contents=prompt,
            config={ 'response_modalities': ["AUDIO"] }
        )

        try:
            pcm_blob = response.candidates[0].content.parts[0].inline_data.data
        except (IndexError, AttributeError) as e:
            print(e)
            raise HTTPException(status_code=500, detail="Failed to extract audio from TTS response.")
        
        if not isinstance(pcm_blob, bytes):
            raise HTTPException(status_code=500, detail=f'Invalid audio data type returned by TTS: {type(pcm_blob)}')

        wav_blob = convert_audio_to_wav(pcm_blob)
        return wav_blob
