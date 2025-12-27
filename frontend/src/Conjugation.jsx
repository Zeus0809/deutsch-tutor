import { useState } from 'react'
import './Conjugation.css'
import { HiSpeakerWave } from "react-icons/hi2";
import { showToast, playPronunciation } from './utils.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Conjugation() {
  const [verb, setVerb] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})
  const [error, setError] = useState('')

  const handleLookup = async () => {
    if (!verb.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/conjugation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verb: verb.trim() })
      });
      
      if (!response.ok) {
        // handle API errors here
        setLoading(false);
        if (response.status === 400){
            setError("Oops! That's not a valid verb.");
        } else {
            setError("Oops! Server error 0_0");
        }
        // exit the function
        return;
      }
      // process response if no errors
      const data = await response.json();
      setLoading(false);
      setResults(data.conjugations);
    } catch (err) {
      console.error('Error: ', err);
      setLoading(false);
      // friendly user error
      setError('Oops! Networking error 0_0');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  }

  return (
    <div className="conjugation-container">
      <div className="conjugation-header">
        VERB CONJUGATION
      </div>
      
      <div className="conjugation-content">
        <div className="conjugation-input-section">
          <input 
            type="text" 
            placeholder="Check Verb"
            value={verb}
            onChange={(e) => setVerb(e.target.value)}
            onKeyDown={handleKeyPress}
            className="conjugation-input"
          />
          <button className="conjugation-send-btn" onClick={handleLookup}>➤</button>
        </div>

        {loading && (
          <div className="conjugation-spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && !loading && (
          <div className="conjugation-error">{error}</div>
        )}

        {results && !loading && (
          <div className="conjugation-results">
            <div className="conjugation-table">
              <div className="conjugation-column">
                <div className="conjugation-cell">ich</div>
                <div className="conjugation-cell">du</div>
                <div className="conjugation-cell">er/sie/es</div>
                <div className="conjugation-cell">wir</div>
                <div className="conjugation-cell">ihr</div>
                <div className="conjugation-cell">sie/Sie</div>
              </div>
              <div className="conjugation-column">
                <div className="conjugation-cell conjugation-cell--verb">
                  <span className="conjugation-cell-text">{results.ich}</span>
                  {results.ich && (
                    <div className="sound-btn sound-btn--small" onClick={() => playPronunciation(`Ich ${results.ich}`, () => showToast("Oops! Error playing the audio."))}>
                      <HiSpeakerWave />
                    </div>
                  )}
                </div>
                <div className="conjugation-cell conjugation-cell--verb">
                  <span className="conjugation-cell-text">{results.du}</span>
                  {results.du && (
                    <div className="sound-btn sound-btn--small" onClick={() => playPronunciation(`Du ${results.du}`, () => showToast("Oops! Error playing the audio."))}>
                      <HiSpeakerWave />
                    </div>
                  )}
                </div>
                <div className="conjugation-cell conjugation-cell--verb">
                  <span className="conjugation-cell-text">{results.er_sie_es}</span>
                  {results.er_sie_es && (
                    <div className="sound-btn sound-btn--small" onClick={() => playPronunciation(`Er ${results.er_sie_es}, Sie ${results.er_sie_es}, Es ${results.er_sie_es}`, () => showToast("Oops! Error playing the audio."))}>
                      <HiSpeakerWave />
                    </div>
                  )}
                </div>
                <div className="conjugation-cell conjugation-cell--verb">
                  <span className="conjugation-cell-text">{results.wir}</span>
                  {results.wir && (
                    <div className="sound-btn sound-btn--small" onClick={() => playPronunciation(`Wir ${results.wir}`, () => showToast("Oops! Error playing the audio."))}>
                      <HiSpeakerWave />
                    </div>
                  )}
                </div>
                <div className="conjugation-cell conjugation-cell--verb">
                  <span className="conjugation-cell-text">{results.ihr}</span>
                  {results.ihr && (
                    <div className="sound-btn sound-btn--small" onClick={() => playPronunciation(`Ihr ${results.ihr}`, () => showToast("Oops! Error playing the audio."))}>
                      <HiSpeakerWave />
                    </div>
                  )}
                </div>
                <div className="conjugation-cell conjugation-cell--verb">
                  <span className="conjugation-cell-text">{results.sie_Sie}</span>
                  {results.sie_Sie && (
                    <div className="sound-btn sound-btn--small" onClick={() => playPronunciation(`Sie ${results.sie_Sie}`, () => showToast("Oops! Error playing the audio."))}>
                      <HiSpeakerWave />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Conjugation
