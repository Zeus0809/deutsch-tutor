import { useState } from 'react'
import './Dictionary.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Dictionary() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mainResult, setMainResult] = useState('')
  const [otherTranslations, setOtherTranslations] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLookup = async () => {
    if (!input.trim()) return;

    setLoading(true);
    // TODO: API call to /dictionary endpoint will be implemented later
    
    
    // Mock response for UI testing
    setTimeout(() => {
      setMainResult('das Haus');
      setOtherTranslations([
        { translation: 'die Wohnung', comments: 'apartment or flat' },
        { translation: 'das Gebäude', comments: 'building (general)' },
        { translation: 'das Heim', comments: 'home (more poetic)' }
      ]);
      setLoading(false);
      setIsExpanded(false);
    }, 1000);
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
            {otherTranslations && (
              <div className={`translation-list ${!isExpanded ? 'collapsed' : ''}`}>
                {otherTranslations.map((item, index) => (
                  <div key={index} className="translation-item">
                    <div className="translation-text">{item.translation}</div>
                    {item.comments && (
                      <div className="translation-comments">{item.comments}</div>
                    )}
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
