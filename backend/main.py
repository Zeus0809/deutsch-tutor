from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from tutor import Tutor
from rest_models import *
import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tutor = Tutor()

@app.get('/api')
def home():
    return {"message" : "Welcome to Deutsch Tutor!"}

@app.get('/api/tutor/start')
def start_conversation():
    return {"initial_message" : tutor.start_conversation()} # returns str

@app.post('/api/tutor/continue')
def send_user_message(request: ChatMessageRequest):
    return {"feedback" : tutor.send_user_message(request.user_message)} # returns str

@app.post('/api/dictionary')
def look_up(request: DictionaryRequest):
    return {"results" : tutor.look_up(request.expression)} # returns List[Dict] or HTTPException

@app.post('/api/conjugation')
def conjugate(request: ConjugationRequest):
    return {"conjugations" : tutor.conjugate(request.verb)} # returns Dict[str, str] or HTTPException

@app.post('/api/noun')
def process_noun(request: NounRequest):
    return {"noun_details" : tutor.get_noun_details(request.noun)} # returns Dict[str, str] or HTTPException

# Build the path: /app/main.py -> /app -> /app/static
static_dir = os.path.join(os.path.dirname(__file__), "static")

# Only set up static file serving if the folder exists (a.k.a if we're in a Docker container, a.k.a in production)
if os.path.exists(static_dir):
    # Mount /assets to make FastAPI understand where to find frontend files
    app.mount(path="/assets", app=StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    # Catch-all route for any other routes: intended for static frontend files
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(static_dir, full_path)
        # If a specific file exists, serve it
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Otherwise serve index.html
        return FileResponse(os.path.join(static_dir, "index.html"))

