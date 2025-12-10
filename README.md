## Deutsch Tutor 0.0.1

### This application is meant to be a tool to help the user learn German. The UX is as follows:
 - user presses Start
 - system uses an LLM to generate a sample sentence in English
 - user translates the sentence into German
 - system uses an LLM to check the translation for mistakes
 - if correct, system proceeds with the next sentence, if wrong, system explains every mistake
 - user retypes the correct translation


### Stack & Next Steps
 - web app
 - use FastAPI for the python backend
 - use Gemini API as LLM vendor (gemini-2.5-pro)
 - prompt engineering (gemini will need a system prompt -> German tutor)
 - try React.js for a polished frontend 

1. Define your system prompt in a constants file or config
2. Create simple prompt templates for each interaction type
3. Call Gemini directly via the SDK with these prompts
4. Handle the responses with simple parsing if needed