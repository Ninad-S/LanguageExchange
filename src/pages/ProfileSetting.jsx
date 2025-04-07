// src/pages/ProfileSetting.jsx
// Rumaisa Bhatti
// Implements two most important test cases:
// TC1 (from Manage Account): User deletes account after confirmation
// TC2 (from Manage/View Profile): User updates bio

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

//This holds the main Profile Settings UI for user
const ProfileSetting = () => {
  //VARIABLES & STATE
  // Stores user bio and user ID
  const [userBio, setUserBio] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  //LOAD USER DATA ON PAGE LOAD 
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      //stores user UID
      setCurrentUserId(user.uid);

      //reference to Firestore document
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      //load bio if user data exist
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setUserBio(data.bio || '');
      }
    };

    fetchUserData(); //run on page mount
  }, []);

  //TC2: Update User Bio 
  const updateUserBio = async () => {
    if (!currentUserId) return;

    try {
      //Update bio in Firestore
      await updateDoc(doc(db, 'users', currentUserId), { bio: userBio });

      alert('Your bio was updated!');
    } catch (err) {
      console.error('Bio update failed:', err);
    }
  };

  //T1: Delete Account with Confirmation 
  const confirmAndDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    //Ask user for confirmation
    const confirmDelete = window.confirm(
      'Delete your account permanently?'
    );
    if (!confirmDelete) return;

    try {
      //1. Remove user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      //2. Remove user from Firebase Authentication
      await deleteUser(user);

      //Confirm deletion
      alert('Account successfully deleted.');
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Error deleting account. You may need to log in again.');
    }
  };

  //FRONT-END UI
  return (
    <div style={{ padding: '20px' }}>
      <h1>Profile Settings</h1>

      {/*Bio Update Box*/}
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="bio">Bio</label>
        <br />
        <textarea
          id="bio"
          rows="4"
          cols="50"
          value={userBio}
          onChange={(e) => setUserBio(e.target.value)}
          placeholder="Tell us about yourself."
        />
        <br />
        <button onClick={updateUserBio}>Save Bio</button>
      </div>

      {/* Account Deletion Box */}
      <div>
        <button
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={confirmAndDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileSetting;
