import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  // auto-scroll chat when messages overflow
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const handleStart = async () => {
    // change view immediately
    setStarted(true);
    setLoading(true);
    // backend call to generate first sentence
    try {
      const response = await fetch(`${API_BASE_URL}/sentence`);
      const data = await response.json();
      setMessages([{ type: 'tutor', text: `Translate the following sentence into German: ${data.sentence}` }]);
    } catch (error) {
      console.error('Error: ', error);
      // friendly user error
      setMessages(prev => [...prev, {
        type: 'tutor',
        text: '❌ Sorry, I couldn\'t process that. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

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
    } catch (error) {
      console.error('Error: ', error);
      // friendly user error
      setMessages(prev => [...prev, {
        type: 'tutor',
        text: '❌ Sorry, I couldn\'t process that. Please try again.',
      }]);
    } finally {
      setLoading(false);
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
                {msg.type === 'tutor' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {loading && (
              <div className="message tutor loading-message">
                <div className="spinner"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="input-area">
            <input 
              type="text" 
              placeholder="Type your message..."
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
