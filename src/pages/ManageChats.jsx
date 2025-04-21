import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './ManageChats.css';
import defaultProfilePicture from './default-profile.png';

const ManageChats = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('chats');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load current user and fetch chats/requests
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser(userData);

            // Set chats and requests
            setChats(userData.chats || []);
            setRequests(userData.chatRequests || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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

  // Fetch updated requests with sender names
  useEffect(() => {
    const fetchRequestsWithNames = async () => {
      const updatedRequests = await Promise.all(
        requests.map(async (req) => {
          const senderDoc = await getDoc(doc(db, 'users', req.senderId));
          if (senderDoc.exists()) {
            const senderData = senderDoc.data();
            return {
              ...req,
              senderName: senderData.name, // Add the sender's name
              profilePicture: senderData.profilePicture || defaultProfilePicture,
            };
          }
          return req;
        })
      );
      setRequests(updatedRequests);
    };

    if (requests.length > 0) {
      fetchRequestsWithNames();
    }
  }, [requests]);

  // Fetch updated chats with user names
  useEffect(() => {
    const fetchChatsWithNames = async () => {
      const updatedChats = await Promise.all(
        chats.map(async (otherUserId) => {
          // Fetch the other user's document
          const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
          if (otherUserDoc.exists()) {
            const otherUserData = otherUserDoc.data();
            return {
              id: otherUserId,
              name: otherUserData.name, // Use the other user's name
              profilePicture: otherUserData.profilePicture || defaultProfilePicture,
            };
          } else {
            console.warn(`User document not found for ID: ${otherUserId}`);
            return {
              id: otherUserId,
              name: 'Unknown User',
              profilePicture: defaultProfilePicture,
            };
          }
        })
      );
      setChats(updatedChats);
    };

    if (chats.length > 0 && currentUser) {
      fetchChatsWithNames();
    }
  }, [chats, currentUser]);

  // Accept a chat request
  const acceptRequest = async (senderId) => {
    const currentUserRef = doc(db, 'users', currentUser.id);
    const senderRef = doc(db, 'users', senderId);

    try {
      // Fetch both users' documents
      const [currentSnap, senderSnap] = await Promise.all([
        getDoc(currentUserRef),
        getDoc(senderRef),
      ]);

      const currentData = currentSnap.data();
      const senderData = senderSnap.data();

      // Remove reverse request (from the other user to the current user)
      const updatedSenderRequests = senderData.chatRequests?.filter(
        (req) => req.senderId !== currentUser.id
      );

      // Update both users' documents in Firestore
      await Promise.all([
        // Add the sender's ID to the current user's chats
        updateDoc(currentUserRef, {
          chats: arrayUnion(senderId),
          chatRequests: (currentData.chatRequests || []).filter((req) => req.senderId !== senderId),
        }),
        // Add the current user's ID to the sender's chats
        updateDoc(senderRef, {
          chats: arrayUnion(currentUser.id),
          chatRequests: updatedSenderRequests || [],
        }),
      ]);

      // Update local state
      setRequests((prev) => prev.filter((req) => req.senderId !== senderId));
      setChats((prev) => [...prev, senderId]); // Add senderId to the local chats array
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Decline a chat request
  const declineRequest = async (senderId) => {
    const currentUserRef = doc(db, 'users', currentUser.id);

    try {
      // Remove the request from the current user's chatRequests
      await updateDoc(currentUserRef, {
        chatRequests: arrayRemove({ senderId }),
      });

      // Update local state
      setRequests((prev) => prev.filter((req) => req.senderId !== senderId));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  // Navigate to a chat
  const handleChatClick = (otherUserId) => {
    navigate(`/chat/${otherUserId}`);
  };

  if (loading) return <p>Loading chats...</p>;
  if (!currentUser) return <p>Please log in to view your chats.</p>;

  return (
    <div className="manage-chats-container">
      <div className="tabs">
        <button
          className={activeTab === 'chats' ? 'active' : ''}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button
          className={activeTab === 'requests' ? 'active' : ''}
          onClick={() => setActiveTab('requests')}
        >
          Requests
        </button>
      </div>

      <div className="chat-list">
        {activeTab === 'chats' && (
          chats.length > 0 ? (
            chats.map(({ id, name, profilePicture }) => (
              <div key={id} className="chat-card" onClick={() => handleChatClick(id)}>
                <img
                  src={profilePicture}
                  alt={`${name || 'User'}'s profile`}
                  className="profile-picture"
                />
                <div className="chat-info">
                  <div className="chat-name">{name || 'Unknown User'}</div>
                  <div className="chat-preview">
                    Say hello and start chatting!
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-chats-msg">
              No existing chats available. Find matching partners to start a chat.
            </p>
          )
        )}

        {activeTab === 'requests' && (
          requests && requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.senderId} className="chat-card request-card">
                <img
                  src={req.profilePicture}
                  alt={`${req.senderName || 'User'}'s profile`}
                  className="profile-picture"
                />
                <div className="chat-info">
                  <div className="chat-name">{req.senderName || 'Unknown'}</div>
                  {req.bio && <div className="chat-bio">{req.bio}</div>}
                </div>
                <div className="chat-buttons">
                  <button className="accept-btn" onClick={() => acceptRequest(req.senderId)}>Accept</button>
                  <button className="decline-btn" onClick={() => declineRequest(req.senderId)}>Decline</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-chats-msg">No pending chat requests.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ManageChats;