// src/pages/ProfileSetting.jsx
// Rumaisa Bhatti
// Implements:
// TC1: Delete Account
// TC2: Update Bio
// TC3: Toggle Profile Visibility

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

const ProfileSetting = () => {
  // ========== STATE ==========
  const [userBio, setUserBio] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [visibility, setVisibility] = useState(true);

  // ========== LOAD USER DATA (on mount) ==========
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn('No user is currently logged in');
        return;
      }

      setCurrentUserId(user.uid);
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        console.log('User data loaded:', data);
        setUserBio(data.bio || '');
        setVisibility(data.visibility ?? true); // default to public
      } else {
        console.warn('User document does not exist in Firestore');
      }
    };

    fetchUserData();
  }, []);

  // ========== TC2: Update User Bio ==========
  const updateUserBio = async () => {
    if (!currentUserId) {
      console.warn('User ID not set when trying to update bio');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUserId), { bio: userBio });
      alert('Your bio was updated!');
    } catch (err) {
      console.error('Bio update failed:', err);
    }
  };

  // ========== TC3: Toggle Profile Visibility ==========
  /*
  const toggleVisibility = async () => {
    console.log('Toggling visibility from', visibility, 'to', !visibility);

    if (!currentUserId) {
      console.warn('User ID not set when trying to toggle visibility');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', currentUserId), {
        visibility: !visibility,
      });
      setVisibility(!visibility);
      alert(`Profile visibility set to ${!visibility ? 'Public' : 'Private'}`);
    } catch (err) {
      console.error('Error updating visibility:', err);
    }
  };
*/

const toggleVisibility = async () => {
  if (!currentUserId) {
    console.warn('User ID not set when trying to toggle visibility');
    return;
  }

  const newVisibility = !visibility;

  try {
    console.log('Updating visibility to:', newVisibility);

    await updateDoc(doc(db, 'users', currentUserId), {
      visibility: newVisibility,
    });

    setVisibility(newVisibility); // update local state AFTER successful update
    alert(`Profile visibility set to ${newVisibility ? 'Public' : 'Private'}`);
  } catch (err) {
    console.error('Error updating visibility:', err);
    alert('There was an error updating your visibility in the database.');
  }
};




  // ========== TC1: Delete Account ==========
  const confirmAndDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No user to delete');
      return;
    }

    const confirmDelete = window.confirm(
      'Delete your account permanently? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      alert('Account successfully deleted.');
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Error deleting account. You may need to re-authenticate.');
    }
  };

  // ========== FRONTEND JSX ==========
  return (
    <div style={{ padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <h1>Profile Settings</h1>

      {/* === Bio Update Section === */}
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

      {/* === Visibility Toggle Section === */}
      
      
      <div style={{ marginBottom: '24px' }}>
  <label>
    <input
      type="checkbox"
      checked={visibility}
      onChange={toggleVisibility}
    />
    {' '}Profile is {visibility ? 'Public' : 'Private'}
  </label>
</div>


      {/* === Delete Account Section === */}
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


//TC: change password 
//TC: Add profile pic 


//Use case 1: Manage Account
//Use case 2: Manage and View Profile
//
//updatePassword
//visibilitySetting

//phase 5 needs 4 test cases, but when presenting final roject we need all of ur test cases .