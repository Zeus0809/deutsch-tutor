import { useState } from 'react'
import './Noun.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Noun() {
  const [noun, setNoun] = useState('');
  const [gender, setGender] = useState('');
  const [plural, setPlural] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!noun.trim()) return;

    setError('');
    setLoading(true);
    setGender(null);
    setPlural(null);

    try {
      // API call to /noun
      const response = await fetch(`${API_BASE_URL}/api/noun`, {
        method: 'POST',
        headers: { 'COntent-Type' : 'application/json' },
        body: JSON.stringify({ noun : noun.trim() })
      });

      if (!response.ok) {
        // handle API errors here
        setLoading(false);
        if (response.status === 400){
            setError("Oops! That's not a valid noun.");
        } else {
            setError("Oops! Server error 0_0");
        }
        // exit the function
        return;
      }
      // process results if no errors
      const data = await response.json();
      setLoading(false);
      setGender(data.noun_details.gender);
      setPlural(data.noun_details.plural);
    } catch (err) {
      // network errors
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
    <div className="noun-container">
      <div className="noun-header">
        NOUN GENDER & PLURAL
      </div>
      
      <div className="noun-content">
        <div className="noun-input-section">
          <input 
            type="text" 
            placeholder="Check Noun"
            value={noun}
            onChange={(e) => setNoun(e.target.value)}
            onKeyDown={handleKeyPress}
            className="noun-input"
          />
          <button className="noun-send-btn" onClick={handleLookup}>➤</button>
        </div>

        {loading && (
          <div className="noun-spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {error && !loading && (
          <div className="noun-error">{error}</div>
        )}

        {gender && plural && !loading && (
          <div className="noun-result-wrapper">
            <div className="result-gender">
              {gender}
            </div>
            <div className="result-plural">
              {plural}
            </div>
          </div>
        )}
       </div>
    </div>
  )
}

export default Noun
