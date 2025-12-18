## Description of new feature under development: Dictionary

The purpose of this is for the user to be able to look up individual words or phrases while doing the translation of sentences from the main chat. Oftentimes, as a language learner, you lack vocabulary knowledge, so this tool should help with that.

### Frontend / UI-UX:
- The UI element has rounded corners
- A black header with the white word 'DICTIONARY' centered in it
- A transparent input area with 'Look Up Word/Phrase' placeholder text
- A Send button styled like the one from main chat
- A spinner appearing under the Send button, styled like the one in main chat
- A 'main result' area, styled in yellow, containing the most relevant translation
- A clickable downward arrow that opens a collapsible list of other possible translation options and brief explanantions of each

### Backend:
- A new FastAPI route '/dictionary' (main.py)
- A new Dictionary prompt to prepend to user's input (prompts.py)
- Think about what LLM to use
- A function to query the LLM with the new prompt (tutor.py)
