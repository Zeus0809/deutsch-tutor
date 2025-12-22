import { useState } from 'react'
import './Conjugation.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Conjugation() {
  const [verb, setVerb] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({
    ich: 'schlafe',
    du: 'schläfst',
    er_sie_es: 'schläft',
    wir: 'schlafen',
    ihr: 'schlaft',
    sie_Sie: 'schlafen'
  })
  const [error, setError] = useState(false)

  const handleLookup = async () => {
    if (!verb.trim()) return;

    setLoading(true);
    setError(false);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/conjugation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verb: verb.trim() })
      });
      
      if (!response.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      setLoading(false);
      setResults(data.conjugations);
    } catch (err) {
      console.error('Error: ', err);
      setLoading(false);
      setError(true);
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
          <div className="conjugation-error">
            Oops! That's not a German verb.
          </div>
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
                <div className="conjugation-cell">{results.ich}</div>
                <div className="conjugation-cell">{results.du}</div>
                <div className="conjugation-cell">{results.er_sie_es}</div>
                <div className="conjugation-cell">{results.wir}</div>
                <div className="conjugation-cell">{results.ihr}</div>
                <div className="conjugation-cell">{results.sie_Sie}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Conjugation
