## Description of new feature under development: Noun Gender Lookup

This is a tool that lets the user look up the gender of a German noun, as well as its plural form.

### Frontend / UI-UX:
- The UI element has rounded corners
- A black header with the white word 'NOUN GENDER & PLURAL' centered in it
- A transparent input area with 'Check Noun' placeholder text
- A Send button styled like the one from main chat, placed to the right of input
- A spinner appearing under the Send button, styled like the one in main chat
- A yellow results area with two sections on top of each other: the noun with its gender article, and the same noun in plural form.
- Example:
  Tisch
  der Tisch
  die Tische

### Backend:
- A new FastAPI route '/noun' (main.py)
- A new prompt to prepend to user's input that asks to return gender and plural form(prompts.py)
- Think about what LLM to use
- A function to query the LLM with the new prompt (tutor.py)
