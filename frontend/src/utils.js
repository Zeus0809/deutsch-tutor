const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// a map to store cached audio blobs
const audioCache = new Map();

export const playPronunciation = async (textToRead, onError) => {
    let audioBlob = null;
    // first check cache, get the blob if cached
    if (audioCache.has(textToRead)) {
        audioBlob = audioCache.get(textToRead);
    } else {
        // if not cached, fetch from backend
        try {
            const response = await fetch(`${API_BASE_URL}/api/pronounce`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: textToRead })
            });

            if (!response.ok) {
                // use callback function for any errors -> should be passed by component
                onError?.();
                return;
            }
            // retrieve and cache the blob
            audioBlob = await response.blob();
            audioCache.set(textToRead, audioBlob);
        } catch (err) {
            // use callback function for any errors -> should be passed by component
            onError?.();
            return;
        }
    }
    // create a fresh blob URL and Audio object each time
    const blobURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(blobURL);
    // revoke blob URL from memory after playback ends
    audio.addEventListener('ended', () => {
        URL.revokeObjectURL(blobURL);
    });
    // and on error
    audio.addEventListener('error', () => {
        URL.revokeObjectURL(blobURL);
    });
    // play
    audio.play();
}

export const showToast = (message) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

