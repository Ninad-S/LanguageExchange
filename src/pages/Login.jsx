
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
//-------------Nevin: Leaderboard-------------------
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
//-------------Nevin: Leaderboard-------------------

//-------------Nevin: Leaderboard-------------------
const checkLoginStreak = async (uid) => {
  const today = new Date().toISOString().split('T')[0];
  const userRef = doc(db, 'Leaderboard', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const lastLogin = data.lastLoginDate;

  if (lastLogin === today) return; // already logged in today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  let newPoints = data.points + 50;

  if (lastLogin === yesterdayStr) {
    newStreak = data.loginStreak + 1;
    newPoints += 10 * newStreak;
  }

  await updateDoc(userRef, {
    lastLoginDate: today,
    loginStreak: newStreak,
    points: newPoints,
  });

  console.log(`🔥 Streak updated! ${newStreak} days, ${newPoints} points`);
};
//-------------Nevin: Leaderboard-------------------

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      //-------------Nevin: Leaderboard-------------------
      const uid = auth.currentUser.uid;
      await checkLoginStreak(uid);
      //-------------Nevin: Leaderboard-------------------

      console.log("✅ Login successful:", auth.currentUser.email);
      navigate('/profile-setting');
    } catch (err) {
      console.error("❌ Login failed:", err.message);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <p>Welcome back! Please log in to continue.</p>
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
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
  }
};

export default Login;
