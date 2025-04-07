import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  // initial messages with sender, language, and translation
  const [messages, setMessages] = useState([
    {
      text: 'Hello, how is it going?',
      translation: 'Hola, ¿cómo va todo?',
      lang: 'es',
      from: 'me'
    },
    {
      text: 'Muy bien, ¿y tú?',
      translation: 'Quite good, how about you?',
      lang: 'en',
      from: 'them'
    },
    {
      text: 'Pretty good as well, did you remember to do your practice?',
      translation: 'Bastante bueno también, ¿te acordaste de hacer tu práctica?',
      lang: 'es',
      from: 'me'
    },
    {
      text: 'Lo he estado posponiendo, ¡pero esta semana seguro!',
      translation: "I've been putting it off, but this week for sure!",
      lang: 'en',
      from: 'them'
    },
    {
      text: 'Well that’s good to hear.',
      translation: 'Bueno, eso es bueno escuchar.',
      lang: 'es',
      from: 'me'
    },
  ]);

  // input field value
  const [input, setInput] = useState('');

  // ref to scroll to latest message
  const chatEndRef = useRef(null);

  // add a new message from 'me'
  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, {
        text: input,
        translation: '(Translation placeholder)',
        lang: 'en',
        from: 'me'
      }]);
      setInput('');
    }
  };

  // scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      {/* top bar */}
      <div style={styles.header}>
        <button style={styles.backButton}>&larr;</button>
        <div style={styles.headerText}>John Doe</div>
        <div style={styles.avatar}>👤</div>
      </div>

      {/* message area */}
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
              {msg.translation} ({msg.lang === 'en' ? 'English' : 'Español'})
            </small>
          </div>
        ))}
        {/* scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      {/* input area */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Send to John"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>📨</button>
      </div>
    </div>
  );
};

// inline styles for layout and appearance
const styles = {
  container: {
    maxWidth: '700px',
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
