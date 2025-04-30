import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, push, onValue, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import axios from 'axios';  // ✅ Add Axios to make HTTP requests

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [currentUserId, setCurrentUserId] = useState('');
  const [chatPath, setChatPath] = useState(null);

  const chatEndRef = useRef(null);
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [userA, userB] = chatId.split('_');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const dbRef = ref(rtdb);

    async function findChatPath() {
      try {
        const path1 = `messages/${userA}_${userB}`;
        const path2 = `messages/${userB}_${userA}`;

        const snapshot1 = await get(child(dbRef, path1));
        if (snapshot1.exists()) {
          setChatPath(path1);
        } else {
          const snapshot2 = await get(child(dbRef, path2));
          if (snapshot2.exists()) {
            setChatPath(path2);
          } else {
            const newPath = `messages/${userA}_${userB}`;
            await push(ref(rtdb, newPath), {
              text: "Chat started!",
              translation: "¡Chat iniciado!",
              lang: "en",
              from: "system",
              timestamp: Date.now()
            });
            setChatPath(newPath);
          }
        }
      } catch (error) {
        console.error("Error checking chat paths:", error);
      }
    }

    findChatPath();
  }, [chatId, userA, userB]);

  useEffect(() => {
    if (!chatPath) return;

    const chatRef = ref(rtdb, chatPath);
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
  }, [chatPath]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() && chatPath && currentUserId) {
      const originalText = input;
      const messageRef = ref(rtdb, chatPath);

      try {
        // ✅ Send text to Flask API for translation
        const response = await axios.post('http://localhost:5001/translate', {
          text: originalText,
          target: targetLang
        });

        const translatedText = response.data.translatedText || '(Translation failed)';

        const newMessage = {
          text: originalText,
          translation: translatedText,
          lang: targetLang,
          from: currentUserId,
          timestamp: Date.now()
        };

        push(messageRef, newMessage);
        setInput('');
      } catch (err) {
        console.error("Error translating/sending message:", err);

        // Fallback if translation API fails
        const fallbackMessage = {
          text: originalText,
          translation: '(Translation failed)',
          lang: targetLang,
          from: currentUserId,
          timestamp: Date.now()
        };

        push(messageRef, fallbackMessage);
        setInput('');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate('/manage-chats')}>
          &larr;
        </button>
        <div style={styles.headerText}>Chat</div>
        <div style={styles.avatar}>👤</div>
      </div>

      <div style={styles.chatBody}>
        {messages
          .filter(msg => msg.from !== 'system')
          .map((msg, index) => {
            const isMyMessage = msg.from === currentUserId;

            return (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(isMyMessage ? styles.myMessage : styles.theirMessage)
                }}
              >
                <div>{msg.text}</div>
                <small style={styles.translation}>
                  {msg.translation} ({languageLabel(msg.lang)})
                </small>
              </div>
            );
          })}
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
          placeholder="Type your message"
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
    fontFamily: 'Inter, sans-serif',
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
