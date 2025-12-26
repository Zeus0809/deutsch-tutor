## New Feature Proposal

The idea here is simple: add ability for the user to hear the correct German pronunciation of words/phrases on screen as they are using the app.

It doesn't make much sense to have this ability in the main chat area, so the feature should be added to all three of the utility areas - the dictionary, verb conjugation, and noun gender & plural.

### UI/UX Goal
A small button with a sound icon that plays the word pronunciation when clicked.

### Backend
Probably need a TTS model. Explore implementation options using the google-genai SDK and pick one that makes the most sense.

## Implementation Plan

### Architecture Overview
**Lazy-loading approach with frontend caching** - generate audio on-demand only when user clicks the sound button, cache for subsequent plays.

### Backend Flow
1. Create new endpoint: `POST /pronunciation` (or similar)
   - Accepts German text/phrase as input
   - Calls TTS model via google-genai SDK to generate audio
   - Returns audio bytes directly with `Content-Type: audio/mpeg` (or audio/wav)
   - No file I/O needed - audio bytes stay in memory

### Frontend Flow
1. Add sound button UI component (icon) next to each word/phrase
2. On button click:
   - Check cache for audio (keyed by the German text)
   - If cached: play immediately
   - If not cached:
     - Make API call to backend with German text
     - Receive audio bytes as response
     - Create Blob from response: `new Blob([audioData], { type: 'audio/mpeg' })`
     - Create Blob URL: `URL.createObjectURL(blob)`
     - Create Audio object: `new Audio(blobUrl)`
     - Store in cache
     - Call `.play()` on Audio object
3. Audio element is invisible (no UI controls) - our custom button controls playback

### Key Technical Details
- **No files created anywhere** - all audio data stays in memory
- **Blob URLs** are local memory references (like `blob:http://localhost:3000/uuid`), not network addresses
- **Audio object** can be created programmatically without adding `<audio>` tag to DOM
- **Cache** stores either the Blob URL or Audio object for instant replay

### Implementation Areas
1. Dictionary component
2. Verb conjugation component  
3. Noun gender & plural component
