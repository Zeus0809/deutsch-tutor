# Deutsch Tutor 🇩🇪

**Version 0.1.0** - Alpha Release

An interactive web application for learning German through translation practice. The app provides English sentences for users to translate into German, then uses AI to provide detailed feedback on their translations.

## Features

- **AI-Powered Learning**: Uses Google's Gemini 2.5 Flash Lite model to generate sentences and evaluate translations
- **Interactive Chat Interface**: Clean, messenger-style chat UI with typewriter effect for tutor responses
- **Real-time Feedback**: Instant evaluation of translations with detailed explanations of mistakes
- **German Flag Theme**: UI styled with Germany's national colors (black, red, yellow)
- **Responsive Design**: Modern, centered layout with smooth transitions

## Tech Stack

### Backend
- **FastAPI**: Python web framework for REST API
- **Google Gemini API**: LLM for sentence generation and translation evaluation
- **Python 3.11**: Core backend language

### Frontend
- **React 19**: UI framework with hooks
- **Vite**: Fast build tool and dev server
- **React Markdown**: For rendering formatted tutor responses
- **CSS3**: Custom styling with CSS variables

## Getting Started

### Prerequisites
- Python >=3.11
- Node.js & npm
- Google Gemini API key

### Installation

1. Clone the repository
2. Set up environment variables:
   - Create `.env` file in the root directory
   - Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
   - Add frontend API URL: `VITE_API_BASE_URL=http://localhost:8000`

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt  # or use your package manager
   ```
   Or with uv:
   ```bash
   uv sync
   ```

5. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

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

## Usage

1. Click the **Start** button on the home screen
2. The tutor will provide an English sentence to translate
3. Type your German translation in the input field
4. Press Enter or click the send button
5. Receive detailed feedback on your translation
6. Continue with the next sentence

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
│       ├── App.css       # Styling with German theme
│       └── assets/       # Logo and images
├── .gitignore
└── README.md
```

## License

MIT

## Contributing

This is an alpha version. Contributions, issues, and feature requests are welcome!
