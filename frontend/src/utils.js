const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// a map to store cached audio blobs
const audioCache = new Map();

export const playPronunciation = async (textToRead, onError) => {
    // first check cache, play audio if already cached
    if (audioCache.has(textToRead)) {
        const audio = audioCache.get(textToRead);
        audio.play();
        return;
    }

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
        // retrieve audio
        const audioBlob = await response.blob();
        const blobURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(blobURL);
        // add to cache
        audioCache.set(textToRead, audio);
        // play
        audio.play();
    } catch (err) {
      // use callback function for any errors -> should be passed by component
      onError?.();
    }
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

