from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tutor import Tutor

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


