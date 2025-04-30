// src/pages/Leaderboard.jsx
// Nevin Shiju
/*
I have implemented a base layout of the leaderboard page for our app.
The leaderboard is displayed with data I inputted for now.
Both the "Congratulate!" and "Add Friend" buttons work as seen in my test cases.
*/

import { useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth } from '../firebase';

import React, { useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  // state with the initial leaderboard data
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Leaderboard'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        //sort the data
        data.sort((a, b) => b.points - a.points);

        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };
  
    fetchLeaderboard();
  }, []);

  const handleCongratulate = async (index) => {
    const currentUID = auth.currentUser?.uid;
    const user = leaderboard[index];
  
    // Check if the user is logged in
    if (!currentUID) {
      alert("Please log in to congratulate.");
      return;
    }
  
    if (user.uid === currentUID) {
      alert("You can't congratulate yourself");
      return;
    }
  
    const hasCongratulated = user.congratulatedBy?.includes(currentUID);
    const newCount = hasCongratulated
      ? user.congratulations - 1
      : user.congratulations + 1;
  
    const updatedUser = {
      ...user,
      congratulations: newCount,
      congratulatedBy: hasCongratulated
        ? user.congratulatedBy.filter(uid => uid !== currentUID)
        : [...(user.congratulatedBy || []), currentUID],
    };
  
    const newLeaderboard = [...leaderboard];
    newLeaderboard[index] = updatedUser;
    setLeaderboard(newLeaderboard);
  
    try {
      const userRef = doc(db, 'Leaderboard', user.id);
  
      await updateDoc(userRef, {
        congratulations: newCount,
        congratulatedBy: hasCongratulated
          ? arrayRemove(currentUID)
          : arrayUnion(currentUID),
      });
    } catch (error) {
      console.error("Error updating congratulations:", error);
    }
  };

  const handleAddFriend = async (index) => {
    const currentUID = auth.currentUser?.uid;
    const targetUser = leaderboard[index];
  
    if (!currentUID) {
      alert("Please log in to send a friend request.");
      return;
    }
    if (currentUID === targetUser.uid) {
      alert("You can't send a friend request to yourself");
      return;
    }
  
    const newStatus = !targetUser.friendRequestSent;
  
    // Update the UI
    const updatedUser = {
      ...targetUser,
      friendRequestSent: newStatus,
    };
    const updatedLeaderboard = [...leaderboard];
    updatedLeaderboard[index] = updatedUser;
    setLeaderboard(updatedLeaderboard);
  
    try {
      const targetRef = doc(db, 'users', targetUser.uid, 'friendRequests', currentUID);
  
      if (newStatus) {
        await setDoc(targetRef, {
          from: currentUID,
          status: 'pending',
          timestamp: new Date(),
        });
      } else {
        await deleteDoc(targetRef);
      }
  
      // no alert, just visual feedback through UI state
    } catch (error) {
      console.error('Failed to update friend request:', error);
    }
  };

  // Get the current user's UID
  const currentUID = auth.currentUser?.uid;
  const loggedInUserIndex = leaderboard.findIndex(user => user.uid === currentUID);
  const loggedInUser = leaderboard[loggedInUserIndex];
  const topUserBgColor = loggedInUserIndex % 2 === 0 ? '#b2e0f5' : '#cbbce5';
  
  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <p className="leaderboard-description">See where you rank among other learners.</p>

      {loggedInUser && (
        <div
          className="leaderboard-user-card highlighted-user"
          style={{ backgroundColor: topUserBgColor, marginBottom: '20px' }}
        >
          <div className="leaderboard-rank">{loggedInUserIndex + 1}</div>

          <div className="user-info">
            <div className="avatar">{}</div>
            <div>
              <div className="user-name">{loggedInUser.name}</div>
              <div className="user-points">{loggedInUser.points} Points</div>
            </div>
          </div>

          <div className="action-buttons">
          <div className="congrats-display">
            Congratulate! ({loggedInUser.congratulations})
          </div>
          </div>
        </div>
      )}

      <div className="leaderboard-user-list">
        {leaderboard.map((user, index) => {
          const bgColor = index % 2 === 0 ? '#b2e0f5' : '#cbbce5';
          const hasCongratulated = user.congratulatedBy?.includes(currentUID);

          return (
            <div
              key={index}
              className={`leaderboard-user-card ${user.uid === currentUID ? 'highlighted-user' : ''}`}
              style={{ backgroundColor: bgColor }}
            >
              <div className="leaderboard-rank">{index + 1}</div>

              <div className="user-info">
                <div className="avatar">
                  {/* add profile pic later */}
                </div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-points">{user.points} Points</div>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => handleCongratulate(index)}
                  className={`congrats-button ${hasCongratulated ? 'active' : ''}`}
                >
                  Congratulate! ({user.congratulations})
                </button>
                <button
                  onClick={() => handleAddFriend(index)}
                  className={`friend-button ${user.friendRequestSent ? 'active' : ''}`}
                >
                  {user.friendRequestSent ? 'Friend Request Sent' : 'Add Friend'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;