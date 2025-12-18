## Description of new feature under development: Verb Conjugation Lookup

This is a tool that lets the user look up verb conjugation in the Present Tense. Other tenses may be added in the future.

### Frontend / UI-UX:
- The UI element has rounded corners
- A black header with the white word 'VERB CONJUGATION' centered in it
- A transparent input area with 'Check Verb' placeholder text
- A Send button styled like the one from main chat
- A spinner appearing under the Send button, styled like the one in main chat
- A yellow results area with two columns: Persons and Verb Form

### Backend:
- A new FastAPI route '/conjugation' (main.py)
- A new Conjugation prompt to prepend to user's input (prompts.py)
- Think about what LLM to use
- A function to query the LLM with the new prompt (tutor.py)
