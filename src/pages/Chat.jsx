import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, push, onValue } from 'firebase/database';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const chatEndRef = useRef(null);
  const { chatId } = useParams();
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (input.trim()) {
      const originalText = input;
      const messageRef = ref(rtdb, `messages/${chatId}`);

      try {
        const newMessage = {
          text: originalText,
          translation: '(Translation failed)', // ✅ fallback
          lang: targetLang,
          from: 'me',
          timestamp: Date.now()
        };

        // Commented out actual translation for now
        /*
        const response = await axios.post('http://localhost:5001/translate', {
          q: originalText,
          source: 'en',
          target: targetLang,
          format: 'text'
        });

        newMessage.translation = response.data.translatedText;
        */

        push(messageRef, newMessage);
        setInput('');
      } catch (err) {
        console.error("Translation error:", err);
      }
    }
  };

  useEffect(() => {
    const chatRef = ref(rtdb, `messages/${chatId}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loaded = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
        setMessages(loaded);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/manage-chats')}>
          &larr;
        </button>
        <div style={styles.headerText}>John Doe</div>
        <div style={styles.avatar}>👤</div>
      </div>

      <div style={styles.chatBody}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.from === 'me' ? styles.myMessage : styles.theirMessage)
            }}
          >
            <div>{msg.text}</div>
            <small style={styles.translation}>
              {msg.translation} ({languageLabel(msg.lang)})
            </small>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputContainer}>
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          style={styles.dropdown}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="en">English</option>
        </select>
        <input
          type="text"
          placeholder="Send to John"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>➡️</button>
      </div>
    </div>
  );
};

const languageLabel = (langCode) => {
  const mapping = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    zh: 'Chinese',
    ja: 'Japanese'
  };
  return mapping[langCode] || langCode;
};

const styles = {
  container: {
    maxWidth: '100%',
    width: '100%',
    margin: '0 auto',
    backgroundColor: '#f4f4f8',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '90vh'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  backButton: {
    fontSize: '20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  avatar: {
    fontSize: '20px',
  },
  chatBody: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  message: {
    padding: '15px',
    borderRadius: '15px',
    maxWidth: '70%',
  },
  myMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#b9b6ff',
    color: '#000',
  },
  theirMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f7d5ff',
    color: '#000',
  },
  translation: {
    fontSize: '0.8em',
    opacity: 0.7,
    marginTop: '5px',
    display: 'block'
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    marginRight: '10px',
    outline: 'none',
  },
  dropdown: {
    marginRight: '10px',
    borderRadius: '20px',
    padding: '10px',
    border: '1px solid #ccc',
  },
  sendButton: {
    fontSize: '20px',
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer'
  }
};

export default Chat;
