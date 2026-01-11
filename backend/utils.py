import io, wave, os, json
from dotenv import load_dotenv
from typing import List, Dict
from google.cloud import logging_v2
from fastapi import HTTPException
from datetime import datetime, timedelta, timezone

GEMINI_LOGS_DAY_RANGE = 30

def convert_audio_to_wav(pcm_data: bytes) -> bytes:
        """Convert raw PCM data from Gemini TTS into a WAV audio blob"""
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1) # Mono
            wav_file.setsampwidth(2) # 16-bit
            wav_file.setframerate(24000) # 24000Hz
            wav_file.writeframes(pcm_data)
        return wav_buffer.getvalue()

def get_current_gemini_usage() -> List[Dict]:
    """
    Access GCP Cloud Run logs for this app and retrieve the latest Gemini usage stats.
    We need this to pick up the logging from where it left off during the last application run.
    """
    load_dotenv()
    client = logging_v2.Client(project=os.getenv('GCP_PROJECT_ID')) # init the logging client
    cutoff_timestamp = (datetime.now(timezone.utc) - timedelta(days=GEMINI_LOGS_DAY_RANGE)).strftime("%Y-%m-%dT%H:%M:%SZ")
    filter_str = (
        'resource.type="cloud_run_revision" AND '
        'resource.labels.service_name="deutsch-tutor" AND '
        'resource.labels.location="europe-west1" AND '
        f'timestamp>="{cutoff_timestamp}" AND '
        'textPayload:"GEMINI_STATS:" AND '
        'textPayload:"model_name" AND '
        'textPayload:"tokens_generated"'
    )
    generator = client.list_entries( # this returns a generator
         filter_=filter_str,
         order_by=logging_v2.DESCENDING,
         max_results=1 # we only need the last entry
    )
    # retrieve the log entry from generator
    latest_entry = next(generator, None)
    if not latest_entry: # if no logs exist yet
         latest_log = []
    else:
        latest_entry = latest_entry.payload
        try: # deserialize
            latest_log = json.loads(latest_entry.replace('GEMINI_STATS: ', ''))
        except json.JSONDecodeError as e:
            print(e)
            raise HTTPException(status_code=500, detail="Failed to parse Gemini API logs from GCP")
    return latest_log
