// src/pages/SignUp.jsx
// Ninad Sudarsanam

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const langs = ['English', 'Spanish', 'German', 'French', 'Japanese', 'Chinese', 'Tamil', 'Hindi', 'Kannada'];

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uid, setUID] = useState('');
  const [knownLangs, setKnownLangs] = useState([]);
  const [learningLangs, setLearningLangs] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const newUID = userCred.user.uid;
      setUID(newUID);
      await setDoc(doc(db, 'users', newUID), {
        id: newUID,
        name: email.split('@')[0],
        knownLangs: [],
        learningLangs: []
      });
      
      //-------------Nevin: Leaderboard-------------------
      //add the user also to the leaderboard
      await setDoc(doc(db, 'Leaderboard', newUID), {
        name: email.split('@')[0],
        uid: newUID,
        points: 50,
        loginStreak: 1,
        lastLoginDate: new Date().toLocaleDateString('en-CA'),
        congratulations: 0,
        congratulatedBy: [],
        friendRequestSent: false,
        correctAnswers: 0,
        quizzesCompleted: 0,
      });
      //-------------Nevin: Leaderboard-------------------

    } catch (err) {
      console.log(err);
      alert('Signup failed: ' + err.message);
    }
  };

  const handleLangSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'users', uid), {
        id: uid,
        name: email.split('@')[0],
        knownLangs,
        learningLangs
      }, { merge: true });
      alert("User created successfully!");
      navigate('/profile-setting');
    } catch (err) {
      console.error(err);
      alert('Failed to save languages: ' + err.message);
    }
  };

  const handleLangChange = (lang, type) => {
    const update = (arr, setArr) =>
      arr.includes(lang)
        ? setArr(arr.filter((l) => l !== lang))
        : setArr([...arr, lang]);
    type === 'known' ? update(knownLangs, setKnownLangs) : update(learningLangs, setLearningLangs);
  };

  return (
    <div style={styles.container}>
      {!uid ? (
        <>
          <h1>Sign Up</h1>
          <p>Create your account to get started.</p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Sign Up</button>
          </form>
        </>
      ) : (
        <>
          <h2>Select your languages</h2>
          <form onSubmit={handleLangSubmit} style={styles.form}>
            <div style={styles.langSection}>
              <h3>Languages You Know</h3>
              {langs.map((lang) => (
                <label key={lang} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={knownLangs.includes(lang)}
                    onChange={() => handleLangChange(lang, 'known')}
                  />
                  {lang}
                </label>
              ))}
            </div>
            <div style={styles.langSection}>
              <h3>Languages You Want to Learn</h3>
              {langs.map((lang) => (
                <label key={lang} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={learningLangs.includes(lang)}
                    onChange={() => handleLangChange(lang, 'learning')}
                  />
                  {lang}
                </label>
              ))}
            </div>
            <button type="submit" style={styles.button}>Submit Languages</button>
          </form>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '20px',
    textAlign: 'center',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '4px'
  },
  button: {
    padding: '10px',
    border: 'none',
    background: '#646cff',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  langSection: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px'
  },
  checkboxLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default SignUp;
