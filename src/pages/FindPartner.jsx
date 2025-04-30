import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './FindPartner.css';
import defaultProfilePicture from './default-profile.png';

const FindPartner = () => {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sentRequests, setSentRequests] = useState({});
  const [loading, setLoading] = useState(true);

  // Load logged-in user from Firebase Auth and fetch user data
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const usersList = usersSnapshot.docs.map(doc => doc.data());

          const loggedInUser = usersList.find(u => u.id === user.uid);
          setCurrentUser(loggedInUser);
          setUsers(usersList);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('User is not authenticated');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Match partners based on language preferences
  useEffect(() => {
    if (currentUser) {
      const findMatches = async () => {
        const matchedUsers = users.filter(user => {
          const isNotCurrentUser = user.id !== currentUser.id;
          const knownMatch = user.knownLangs?.some(lang =>
            currentUser.learningLangs?.includes(lang)
          );
          const learningMatch = user.learningLangs?.some(lang =>
            currentUser.knownLangs?.includes(lang)
          );
          return isNotCurrentUser && knownMatch && learningMatch;
        });

        setMatches(matchedUsers);

        // Fetch existing requests from Firestore and update `sentRequests` state
        const statusMap = {};
        for (const match of matchedUsers) {
          const receiverRef = doc(db, 'users', match.id);
          const receiverSnap = await getDoc(receiverRef);

          if (receiverSnap.exists()) {
            const receiverData = receiverSnap.data();

            // Check if the current user has already sent a request to this match
            const existingRequest = receiverData.chatRequests?.some(
              (request) => request.senderId === currentUser.id
            );

            if (existingRequest) {
              statusMap[match.id] = 'pending';
            }
          }
        }

        setSentRequests(statusMap);
      };

      findMatches();
    }
  }, [currentUser, users]);

  // Send a chat request
  const handleSendRequest = async (match) => {
    if (!currentUser || !match) return;

    try {
      // Update the receiver's `chatRequests` array in Firestore
      const receiverRef = doc(db, 'users', match.id);
      await updateDoc(receiverRef, {
        chatRequests: arrayUnion({
          senderId: currentUser.id,
          senderName: currentUser.name,
          timestamp: new Date().toISOString(),
        }),
      });

      // Update the local state to reflect the "pending" status
      setSentRequests((prev) => ({ ...prev, [match.id]: 'pending' }));
    } catch (error) {
      console.error("Error sending chat request:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="find-partner-container">
      <h1>Find Your Language Partner</h1>
      <p>These partners match your language preferences. Send a request to start chatting!</p>

      {matches.length > 0 ? (
        <div className="partner-list">
          {matches.map(match => {
            const status = sentRequests[match.id];

            return (
              <div key={match.id} className="partner-card">
                <div className="partner-main">
                  <div className="partner-profile-picture">
                    <img
                      src={match.profilePicture || defaultProfilePicture}
                      alt={`${match.name}'s profile`}
                      className="find-partner-profile-picture"
                    />
                  </div>
                  <div className="partner-info">
                    <h2>{match.name}</h2>
                    <p>Known Languages: {match.knownLangs.join(', ')}</p>
                    <p>Target Languages: {match.learningLangs.join(', ')}</p>
                    {match.bio && <p className="partner-bio">{match.bio}</p>}
                  </div>
                </div>
                {status === 'pending' ? (
                  <button className="chat-request-button" disabled>
                    Request Sent
                  </button>
                ) : (
                  <button className="chat-request-button" onClick={() => handleSendRequest(match)}>
                    Send Chat Request
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No matches found. Please adjust your preferences.</p>
      )}
    </div>
  );
};

export default FindPartner;