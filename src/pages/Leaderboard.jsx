// src/pages/Leaderboard.jsx
//Nevin Shiju
import React, { useState } from 'react';

// initial data
const initialData = [
  { name: 'John Doe', points: 5000, congratulations: 6, hasCongratulated: false, friendRequestSent: false },
  { name: 'John Doe', points: 4800, congratulations: 4, hasCongratulated: false, friendRequestSent: false },
  { name: 'John Doe', points: 4600, congratulations: 2, hasCongratulated: false, friendRequestSent: false },
  { name: 'John Doe', points: 4400, congratulations: 2, hasCongratulated: false, friendRequestSent: false },
  { name: 'John Doe', points: 4200, congratulations: 2, hasCongratulated: false, friendRequestSent: false },
];

const Leaderboard = () => {
  // state with the initial leaderboard data
  const [leaderboard, setLeaderboard] = useState(initialData);

  // congratulations button
  const handleCongratulate = (index) => {
    const newLeaderboard = leaderboard.map((user, idx) => {
      if (idx === index) {
        let newCongratulations;
        if (user.hasCongratulated) {
          newCongratulations = user.congratulations - 1;
        } 
        else {
          newCongratulations = user.congratulations + 1;
        }
        return {
          ...user,
          congratulations: newCongratulations,
          hasCongratulated: !user.hasCongratulated,
        };
      } 
      else {
        return user;
      }
    });
    setLeaderboard(newLeaderboard);
  };

  // add friend button
  const handleAddFriend = (index) => {
    const newLeaderboard = leaderboard.map((user, idx) => {
      if (idx === index) {
        // check the current friend request status
        if (user.friendRequestSent) {
          // if a friend request was already sent, set it to false.
          return { 
            ...user, friendRequestSent: false 
          };
        } 
        else {
          return { 
            ...user, friendRequestSent: true 
          };
        }
      } 
      else {
        return user;
      }
    });
    setLeaderboard(newLeaderboard);
  };

  return (
    // main container with padding
    <div style={{ padding: '2rem' }}>

      {/* title and description */}
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Leaderboard
      </h1>
      <p style={{ marginBottom: '1.5rem' }}>
        See where you rank among other learners.
      </p>

      {/* container for users */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {leaderboard.map((user, index) => {

          // alternate background color.
          const bgColor = index % 2 === 0 ? '#b2e0f5' : '#cbbce5';

          return (

            // user card container with key and styles
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: bgColor,
                borderRadius: '10px',
                padding: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              {/* user rank (index + 1) */}
              <div style={{ width: '30px', fontWeight: 'bold' }}>
                {index + 1}
              </div>

              {/* user information: pp, name, and points */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: 1,
                }}
              >
                {/* profile pic placeholder */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#e2d3e9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >

                {/* Emoji or image can go here */}
                {/* add later */}

                </div>
                {/* User name and points */}
                <div>
                  <div style={{ fontWeight: '600' }}>{user.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    {user.points} Points
                  </div>
                </div>
              </div>

              {/* Container for the two buttons*/}
              <div style={{ display: 'flex', gap: '10px' }}>

                {/* Congratulate Button */}
                <button
                  onClick={() => handleCongratulate(index)}
                  style={{
                    backgroundColor: user.hasCongratulated ? '#d4edda' : 'white',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Congratulate! ({user.congratulations})
                </button>

                {/* Add Friend Button */}
                <button
                  onClick={() => handleAddFriend(index)}
                  style={{
                    backgroundColor: user.friendRequestSent ? '#a2d5f2' : 'white',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
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
