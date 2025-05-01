// Rumaisa Bhatti
// Implements:
// TC1: Delete Account
// TC2: Update Bio
// TC3: Toggle Profile Visibility
// src/pages/ProfileSetting.jsx
import { auth, db } from '../firebase';
import React, { useEffect, useState } from 'react';
import './ProfileSetting.css'; // <-- your css file
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const ProfileSetting = () => {
  // ================= STATE =================
  const [userBio, setUserBio] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [visibility, setVisibility] = useState(true);
  const [activeSection, setActiveSection] = useState('manageAccount'); // <-- for switching pages

  //friends and suggestions
  const [friends, setFriends] = useState(['John Doe']);
  const [suggestions, setSuggestions] = useState(['Jane Smith', 'Alex Kim']);
  // Language Management

  const [knownLanguages, setKnownLanguages] = useState(['English']);
  const [targetLanguages, setTargetLanguages] = useState(['Spanish']);
  const [inProgressLanguages, setInProgressLanguages] = useState(['French']);

  const [showDropdown, setShowDropdown] = useState({
    known: false,
    target: false,
    progress: false,
  });
  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Japanese',
    'Mandarin',
  ];

  // ================= LOAD USER DATA =================
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
        setUserBio(data.bio || '');
        setVisibility(data.visibility ?? true); // default to public
      } else {
        console.warn('User document does not exist in Firestore');
      }
    };

    fetchUserData();
  }, []);

  // ================= TC2: Update User Bio =================
  const updateUserBio = async () => {
    if (!currentUserId) return;

    try {
      await updateDoc(doc(db, 'users', currentUserId), {
        bio: userBio,
      });
      alert('Your bio was updated!');
    } catch (err) {
      console.error('Bio update failed: ', err);
    }
  };

  // ================= TC3: Toggle Profile Visibility =================
  const toggleVisibility = async () => {
    if (!currentUserId) return;

    const newVisibility = !visibility;

    try {
      await updateDoc(doc(db, 'users', currentUserId), {
        visibility: newVisibility,
      });
      setVisibility(newVisibility);
      alert(
        `Profile visibility set to ${newVisibility ? 'Public' : 'Private'}`
      );
    } catch (err) {
      console.error('Error updating visibility: ', err);
      alert('There was an error updating your visibility in the database.');
    }
  };

  //add friends

  const addFriend = name => {
    setFriends(prev => [...prev, name]);
    setSuggestions(prev => prev.filter(n => n !== name));
  };

  const removeFriend = name => {
    setFriends(prev => prev.filter(n => n !== name));
  };

  const removeSuggestion = name => {
    setSuggestions(prev => prev.filter(n => n !== name));
  };

  const addLanguage = (section, language) => {
    if (!language) return;
    if (section === 'known') setKnownLanguages(prev => [...prev, language]);
    if (section === 'target') setTargetLanguages(prev => [...prev, language]);
    if (section === 'progress')
      setInProgressLanguages(prev => [...prev, language]);
  };

  const removeLanguage = (section, language) => {
    if (section === 'known')
      setKnownLanguages(prev => prev.filter(l => l !== language));
    if (section === 'target')
      setTargetLanguages(prev => prev.filter(l => l !== language));
    if (section === 'progress')
      setInProgressLanguages(prev => prev.filter(l => l !== language));
  };

  // ================= TC1: Delete Account =================
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
      await user.delete();
      alert('Account successfully deleted.');
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Error deleting account. You may need to re-authenticate.');
    }
  };

  // ================= FRONTEND LAYOUT JSX =================
  return (
    <div className='profile-settings-container'>
      {/* Manage Account Section */}
      {activeSection === 'manageAccount' && (
        <div className='manage-account'>
          <h1>Manage Account</h1>
          <div className='button-grid'>
            <button onClick={() => setActiveSection('profile')}>Profile</button>
          </div>
        </div>
      )}

      {/* Profile Page Section */}
      {activeSection === 'profile' && (
        <div className='profile-page'>
          <button
            className='back-button'
            onClick={() => setActiveSection('manageAccount')}
          >
            ← Back
          </button>

          <h1>Profile</h1>

          <div className='profile-content'>
            {/* Left side */}
            <div className='left-section'>
              <div className='bio-section'>
                <label htmlFor='bio'>Bio:</label>
                <textarea
                  id='bio'
                  rows='4'
                  cols='50'
                  value={userBio}
                  onChange={e => setUserBio(e.target.value)}
                  placeholder='Tell us about yourself.'
                />
                <button onClick={updateUserBio}>Save Bio</button>
              </div>

              <div className='languages-section'>
                <h3>
                  Known Languages:
                  <button
                    onClick={() =>
                      setShowDropdown({
                        ...showDropdown,
                        known: !showDropdown.known,
                      })
                    }
                  >
                    ➕
                  </button>
                </h3>

                {knownLanguages.map((lang, index) => (
                  <button key={index}>
                    {lang}
                    <span
                      onClick={() =>
                        setKnownLanguages(
                          knownLanguages.filter(l => l !== lang)
                        )
                      }
                      style={{ marginLeft: '6px', color: 'red' }}
                    >
                      ✖
                    </span>
                  </button>
                ))}

                {showDropdown.known && (
                  <select
                    onChange={e => {
                      const selected = e.target.value;
                      if (selected && !knownLanguages.includes(selected)) {
                        setKnownLanguages([...knownLanguages, selected]);
                      }
                    }}
                  >
                    <option value=''>Select a language</option>
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                )}

                <h3>
                  Target Languages:
                  <button
                    onClick={() =>
                      setShowDropdown({
                        ...showDropdown,
                        target: !showDropdown.target,
                      })
                    }
                  >
                    ➕
                  </button>
                </h3>

                {targetLanguages.map((lang, index) => (
                  <button key={index}>
                    {lang}
                    <span
                      onClick={() =>
                        setTargetLanguages(
                          targetLanguages.filter(l => l !== lang)
                        )
                      }
                      style={{ marginLeft: '6px', color: 'red' }}
                    >
                      ✖
                    </span>
                  </button>
                ))}

                {showDropdown.target && (
                  <select
                    onChange={e => {
                      const selected = e.target.value;
                      if (selected && !targetLanguages.includes(selected)) {
                        setTargetLanguages([...targetLanguages, selected]);
                      }
                    }}
                  >
                    <option value=''>Select a language</option>
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                )}

                <h3>
                  In Progress:
                  <button
                    onClick={() =>
                      setShowDropdown({
                        ...showDropdown,
                        progress: !showDropdown.progress,
                      })
                    }
                  >
                    ➕
                  </button>
                </h3>

                {inProgressLanguages.map((lang, index) => (
                  <button key={index}>
                    {lang}
                    <span
                      onClick={() =>
                        setInProgressLanguages(
                          inProgressLanguages.filter(l => l !== lang)
                        )
                      }
                      style={{ marginLeft: '6px', color: 'red' }}
                    >
                      ✖
                    </span>
                  </button>
                ))}

                {showDropdown.progress && (
                  <select
                    onChange={e => {
                      const selected = e.target.value;
                      if (selected && !inProgressLanguages.includes(selected)) {
                        setInProgressLanguages([
                          ...inProgressLanguages,
                          selected,
                        ]);
                      }
                    }}
                  >
                    <option value=''>Select a language</option>
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className='privacy-toggle'>
                <h3>Privacy Setting:</h3>
                <label>
                  <input
                    type='checkbox'
                    checked={!visibility}
                    onChange={toggleVisibility}
                  />
                  {visibility ? 'Public Profile' : 'Private Profile'}
                </label>
              </div>

              <div className='delete-account'>
                <button
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    padding: '10px 20px',
                    marginTop: '20px',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={confirmAndDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Right side */}
            <div className='right-section'>
              <h3>Friends:</h3>
              <ul>
                {friends.map(name => (
                  <li key={name}>
                    {name}
                    <button
                      onClick={() => removeFriend(name)}
                      style={{
                        marginLeft: '10px',
                        color: 'red',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              <h3>Suggestions:</h3>
              <ul>
                {suggestions.map(name => (
                  <li key={name}>
                    {name}
                    <button
                      onClick={() => addFriend(name)}
                      style={{
                        marginLeft: '10px',
                        color: 'green',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ➕
                    </button>
                    <button
                      onClick={() => removeSuggestion(name)}
                      style={{
                        marginLeft: '5px',
                        color: 'red',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
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
