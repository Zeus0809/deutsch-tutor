import { useState } from 'react'
import './Dictionary.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Dictionary() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mainResult, setMainResult] = useState('')
  const [allResults, setAllResults] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLookup = async () => {
    if (!input.trim()) return;

    setLoading(true);
    // API call to /dictionary endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/api/dictionary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: input })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLoading(false);
      // Populate mainResult and all results only if results is a non-empty array
      if (Array.isArray(data.results) && data.results.length > 0) {
        setMainResult(data.results[0].translation);
        setAllResults(data.results);
      } else {
        setMainResult('No results found');
        setAllResults([]);
      }
      // hide the list
      setIsExpanded(false)
    } catch (error) {
      console.error('Error: ', error);
      setLoading(false);
      // friendly user error
      setMainResult('Oops! Networking error 0_0');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="dictionary-container">
      <div className="dictionary-header">
        DICTIONARY
      </div>
      
      <div className="dictionary-content">
        <div className="dictionary-input-section">
          <input 
            type="text" 
            placeholder="Look Up Word/Phrase"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="dictionary-input"
          />
          <button className="dictionary-send-btn" onClick={handleLookup}>➤</button>
        </div>

        {loading && (
          <div className="dictionary-spinner-container">
            <div className="spinner"></div>
          </div>
        )}

        {mainResult && !loading && (
          <div className="result-wrapper">
            <div className="main-result">
              {mainResult}
            </div>
            <div className="plus-expander" onClick={toggleExpanded}>more</div>
            {allResults.length > 0 && (
              <div className={`translation-list ${!isExpanded ? 'collapsed' : ''}`}>
                {allResults.map((item, index) => (
                  <div key={index} className="translation-item">
                    <div className="translation-text">{item.translation}</div>
                    <div className="translation-comments">{item.comments}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
       </div>
    </div>
  )
}

export default Dictionary
