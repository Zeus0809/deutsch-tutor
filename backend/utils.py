import io, wave

def convert_audio_to_wav(pcm_data: bytes) -> bytes:
        """Convert raw PCM data from Gemini TTS into a WAV audio blob"""
        wav_buffer = io.BytesIO()
        with wave.open(wav_buffer, 'wb') as wav_file:
            wav_file.setnchannels(1) # Mono
            wav_file.setsampwidth(2) # 16-bit
            wav_file.setframerate(24000) # 24000Hz
            wav_file.writeframes(pcm_data)
        return wav_buffer.getvalue()

