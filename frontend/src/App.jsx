import { useState } from 'react'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)
  const [sentence, setSentence] = useState('')

  const handleStart = () => {
    // You'll add the backend call here
    setSentence('This is a sample sentence') // Placeholder
    setStarted(true)
  }

  return (
    <div className="App">
      <h1 className={started ? 'logo-small' : ''}>🇩🇪 Deutsch Tutor</h1>
      
      {!started ? (
        <div className="start-section">
          <button onClick={handleStart}>Start</button>
        </div>
      ) : (
        <div className="chat-section">
          <div className="messages-area">
            <div className="message">
              <p>Translate the following sentence into German:</p>
              <p className="sentence">{sentence}</p>
            </div>
          </div>
          
          <div className="input-area">
            <input 
              type="text" 
              placeholder="Type a message..."
            />
            <button className="send-btn">➤</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
