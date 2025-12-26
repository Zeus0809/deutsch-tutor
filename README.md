# Deutsch Tutor 🇩🇪

**Version 0.3.0** - Alpha Release

An interactive web application for learning German through translation practice. The app provides English sentences for users to translate into German, then uses AI to provide detailed feedback on your translations. Additionally, integrated language utilities help you look up words, conjugate verbs, and check noun genders while you learn.

## Features

### Core Learning
- **AI-Powered Learning**: Uses Google's Gemini 2.5 Flash Lite model to generate sentences and evaluate translations
- **Interactive Chat Interface**: Clean, messenger-style chat UI with typewriter effect for tutor responses
- **Real-time Feedback**: Instant evaluation of translations with detailed explanations of mistakes
- **Continuous Learning**: After each translation, receive feedback and move on to the next challenge

### Language Utilities
- **Dictionary**: Look up German-English translations for words and phrases with multiple meanings and context
- **Verb Conjugation**: Check present tense conjugations for German verbs across all pronouns (ich, du, er/sie/es, wir, ihr, sie/Sie)
- **Noun Helper**: Look up noun genders (der/die/das) and plural forms

### Design & UX
- **German Flag Theme**: UI styled with Germany's national colors (black, red, yellow)
- **Responsive Design**: Modern, centered layout with smooth transitions and auto-scrolling chat
- **Loading Indicators**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages for network and validation errors
- **Pronunciation Feature**: User can listen to Gemini-generated audio clips of German vocabulary that they look up in the utilities.

### Deployment
- **Docker Support**: Multi-stage Dockerfile for production deployment
- **Static File Serving**: Backend serves built frontend as static files in production
- **Environment Configuration**: Flexible configuration for development and production environments

## Tech Stack

### Backend
- **FastAPI**: Python web framework for REST API
- **Google Gemini API**: LLM for sentence generation and translation evaluation
- **Python 3.11**: Core backend language
- **uv**: Fast Python package manager

### Frontend
- **React 19**: UI framework with hooks
- **Vite**: Fast build tool and dev server
- **React Markdown**: For rendering formatted tutor responses
- **CSS3**: Custom styling with CSS variables

### DevOps
- **Docker**: Multi-stage build for optimized production deployment
- **uvicorn**: ASGI server for FastAPI

## Getting Started

### Prerequisites
- Python >=3.11
- Node.js & npm
- Google Gemini API key
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository

2. Set up environment variables:
   - Create `.env` file in the root directory
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
   - Add frontend API URL: `VITE_API_BASE_URL=http://localhost:8000` (for development)

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt  # or use your package manager
   ```
   Or with uv:
   ```bash
   uv sync
   ```

4. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   Server runs on `http://localhost:8000`

2. Start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

#### Production Mode (Docker)

1. Build the Docker image:
   ```bash
   docker build -t deutsch-tutor .
   ```

2. Run the container:
   ```bash
   docker run -p 8001:8001 --env-file .env deutsch-tutor
   ```
   App runs on `http://localhost:8001`

## Usage

### Translation Practice

1. Click the **Start** button on the home screen
2. The tutor will provide an English sentence to translate
3. Type your German translation in the input field
4. Press Enter or click the send button
5. Receive detailed feedback on your translation with word-by-word analysis
6. Continue with the next sentence

### Using Language Utilities

**Dictionary**:
- Type a word or phrase in the Dictionary panel on the right
- View the main translation and click "more" to see alternative meanings with context

**Verb Conjugation**:
- Enter a German verb in the Conjugation panel on the left
- View present tense conjugations for all pronouns

**Noun Gender & Plural**:
- Enter a German noun in the Noun panel on the left
- View the correct article (der/die/das) and plural form

## API Endpoints

- `GET /api` - Welcome message
- `GET /api/tutor/start` - Start a new conversation and get the first sentence
- `POST /api/tutor/continue` - Submit a translation and receive feedback
- `POST /api/dictionary` - Look up word/phrase translations
- `POST /api/conjugation` - Get verb conjugations
- `POST /api/noun` - Get noun gender and plural form

## Project Structure

```
deutsch-tutor/
├── backend/
│   ├── main.py           # FastAPI server & endpoints
│   ├── tutor.py          # Gemini integration & logic
│   ├── prompts.py        # System & user prompts
│   └── rest_models.py    # Pydantic models
├── frontend/
│   └── src/
│       ├── App.jsx       # Main React component
│       ├── Dictionary.jsx # Dictionary utility component
│       ├── Conjugation.jsx # Verb conjugation component
│       ├── Noun.jsx      # Noun helper component
│       ├── App.css       # Main styling
│       └── assets/       # Logo and images
├── Dockerfile            # Multi-stage production build
├── .dockerignore         # Docker build exclusions
├── pyproject.toml        # Python project configuration
├── uv.lock               # Python dependency lock file
├── .gitignore
└── README.md
```

## License

MIT

## Contributing

This is an alpha version. Contributions, issues, and feature requests are welcome!
