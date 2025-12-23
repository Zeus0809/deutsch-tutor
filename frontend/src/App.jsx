import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import logo from './assets/logo.png'
import Dictionary from './Dictionary'
import Conjugation from './Conjugation'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''; // leave empty if no env is set (production)

function App() {
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  const typewriterQueue = useRef([])
  const typewriterActive = useRef(false)

  // auto-scroll chat when messages overflow
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  // Typewriter effect: display text word-by-word
  const typewriterEffect = (messageIndex, newText) => {
    // Add to queue
    typewriterQueue.current.push({ messageIndex, newText });
    
    // Start processing if not already active
    if (!typewriterActive.current) {
      processTypewriterQueue();
    }
  }

  const processTypewriterQueue = () => {
    if (typewriterQueue.current.length === 0) {
      typewriterActive.current = false;
      return;
    }

    typewriterActive.current = true;
    const { messageIndex, newText } = typewriterQueue.current.shift();
    
    // Split into words for word-by-word effect
    const words = newText.split(' ');
    let currentIndex = 0;
    let displayedText = '';

    const typeNextWord = () => {
      if (currentIndex < words.length) {
        displayedText += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[messageIndex]) {
            newMessages[messageIndex] = {
              ...newMessages[messageIndex],
              text: displayedText
            };
          }
          return newMessages;
        });
        currentIndex++;
        setTimeout(typeNextWord, 30); // 30ms delay between words
      } else {
        // Done with this chunk, process next in queue
        processTypewriterQueue();
      }
    };

    typeNextWord();
  }

  const handleStart = async () => {
    // change view immediately
    setStarted(true);
    setLoading(true);
    // backend call to generate first sentence
    try {
      const response = await fetch(`${API_BASE_URL}/api/sentence`);
      const data = await response.json();
      setLoading(false);
      // Add empty message and apply typewriter effect
      const messageIndex = 0;
      setMessages([{ type: 'tutor', text: '' }]);
      typewriterEffect(messageIndex, `Translate the following sentence into German:\n ${data.sentence}`);
    } catch (error) {
      console.error('Error: ', error);
      setLoading(false);
      // friendly user error
      setMessages([{
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
    const messageIndex = messages.length + 1; // tutor message index
    setUserInput('');
    setLoading(true);

    // backend call to the /check endpoint
    try {
      const response = await fetch(`${API_BASE_URL}/api/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translation: userInput })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLoading(false);
      // Add empty message and apply typewriter effect
      setMessages(prev => [...prev, { type: 'tutor', text: '' }]);
      typewriterEffect(messageIndex, data.feedback);
    } catch (error) {
      console.error('Error: ', error);
      setLoading(false);
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
      <img src={logo} alt="Deutsch Tutor" className={started ? 'logo logo-small' : 'logo'} />
      
      {!started ? (
        <div className="start-section">
          <button onClick={handleStart}>Start</button>
        </div>
      ) : (
        <div className="main-content">
          <Conjugation />
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
          
          <Dictionary />
        </div>
      )}
    </div>
  )
}

export default App
