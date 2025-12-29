import io, wave, os, json
from dotenv import load_dotenv
from typing import List, Dict
from google.cloud import logging_v2
from google.cloud.logging_v2 import DESCENDING
from fastapi import HTTPException

def convert_audio_to_wav(pcm_data: bytes) -> bytes:
        """Convert raw PCM data from Gemini TTS into a WAV audio blob"""
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1) # Mono
            wav_file.setsampwidth(2) # 16-bit
            wav_file.setframerate(24000) # 24000Hz
            wav_file.writeframes(pcm_data)
        return wav_buffer.getvalue()

def read_gemini_logs() -> List[Dict]:
    """
    Access GCP Cloud Run logs for this app and retrieve the latest Gemini usage stats.
    We need this to pick up the logging from where it left off during the last application run.
    """
    load_dotenv()
    client = logging_v2.Client(project=os.getenv('GCP_PROJECT_ID')) # init the logging client
    filter_str = 'textPayload:"CUSTOM_TEST"'
    entries = client.list_entries( # this returns a generator
         filter_=filter_str,
         order_by=DESCENDING
    )
    # retrieve the latest log entry from generator
    latest_entry = ''
    for entry in entries:
        latest_entry = entry.payload
        break
    if not latest_entry: # if no logs exist yet
         latest_log = []
    else:
        try: # deserialize
            latest_log = json.loads(latest_entry.replace('CUSTOM_TEST: ', ''))
        except json.JSONDecodeError as e:
            print(e)
            raise HTTPException(status_code=500, detail="Failed to parse Gemini API logs from GCP")
    return latest_log
