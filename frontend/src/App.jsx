import { useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [started, setStarted] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([])

  const handleStart = async () => {
    // You'll add the backend call here
    try {
      const response = await fetch(`${API_BASE_URL}/sentence`);
      const data = await response.json();
      setMessages([{ type: 'tutor', text: `Translate the following sentence into German: ${data.sentence}` }]);
      setStarted(true);
    } catch (error) {
      console.error('Error: ', error);
      // friendly user error
      setMessages(prev => [...prev, {
        type: 'tutor',
        text: '❌ Sorry, I couldn\'t process that. Please try again.',
      }]);
    }
  }

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);

    // backend call here to the /check endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translation: userInput })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const tutorMessage = { type: 'tutor',  text: data.feedback};
      setMessages(prev => [...prev, tutorMessage]);
      setUserInput('');
    } catch (error) {
      console.error('Error: ', error);
      // friendly user error
      setMessages(prev => [...prev, {
        type: 'tutor',
        text: '❌ Sorry, I couldn\'t process that. Please try again.',
      }]);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
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
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          
          <div className="input-area">
            <input 
              type="text" 
              placeholder="Type your translation..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="send-btn" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
