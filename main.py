from fastapi import FastAPI
from tutor import Tutor

app = FastAPI()
tutor = Tutor()

@app.get('/')
def home():
    return {"message" : "Welcome to Deutsch Tutor!"}

@app.get('/sentence')
def get_sentence():
    return {"sentence" : tutor.get_sample_sentence()}

@app.post('/check')
def check_translation(translation: str):
    return {"feedback" : tutor.check_translation(translation)}


