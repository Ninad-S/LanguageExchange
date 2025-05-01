import React, { useEffect, useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './ManageChats.css';
import defaultProfilePicture from './default-profile.png';
import emptyChat from '../assets/empty-chat.svg';

// Helper function to always create sorted chatId
function createChatId(user1, user2) {
  return [user1, user2].sort().join('_');
}

const ManageChats = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('chats');
  const [showMenuFor, setShowMenuFor] = useState(null); // NEW for tracking which chat menu is open
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Load current user and fetch chats/requests
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);

        const unsubscribeUser = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUser(userData);

            // Enrich chat requests
            const enrichedRequests = await Promise.all(
              (userData.chatRequests || []).map(async (req) => {
                const senderDoc = await getDoc(doc(db, 'users', req.senderId));
                if (senderDoc.exists()) {
                  const senderData = senderDoc.data();
                  return {
                    ...req,
                    senderName: senderData.name,
                    profilePicture: senderData.profilePicture || defaultProfilePicture,
                  };
                }
                return {
                  ...req,
                  senderName: 'Unknown User',
                  profilePicture: defaultProfilePicture,
                };
              })
            );
            setRequests(enrichedRequests);

            // Enrich chats
            const enrichedChats = await Promise.all(
              (userData.chats || []).map(async (otherUserId) => {
                const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
                if (otherUserDoc.exists()) {
                  const otherUserData = otherUserDoc.data();
                  return {
                    id: otherUserId,
                    name: otherUserData.name,
                    profilePicture: otherUserData.profilePicture || defaultProfilePicture,
                  };
                }
                return {
                  id: otherUserId,
                  name: 'Unknown User',
                  profilePicture: defaultProfilePicture,
                };
              })
            );
            setChats(enrichedChats);
          }

          setLoading(false); // Moved here to trigger only after doc loads
        });

        // Clean up Firestore listener
        return () => unsubscribeUser();
      } else {
        console.warn('User is not authenticated');
        setLoading(false);
      }
    });

    // Clean up Auth listener
    return () => unsubscribe();
  }, []);

  // Accept a chat request
  const acceptRequest = async (senderId) => {
    const currentUserRef = doc(db, 'users', currentUser.id);
    const senderRef = doc(db, 'users', senderId);

    try {
      const [currentSnap, senderSnap] = await Promise.all([
        getDoc(currentUserRef),
        getDoc(senderRef),
      ]);

      const currentData = currentSnap.data();
      const senderData = senderSnap.data();

      const updatedSenderRequests = senderData.chatRequests?.filter(
        (req) => req.senderId !== currentUser.id
      );

      await Promise.all([
        updateDoc(currentUserRef, {
          chats: arrayUnion(senderId),
          chatRequests: (currentData.chatRequests || []).filter((req) => req.senderId !== senderId),
        }),
        updateDoc(senderRef, {
          chats: arrayUnion(currentUser.id),
          chatRequests: updatedSenderRequests || [],
        }),
      ]);

      setRequests((prev) => prev.filter((req) => req.senderId !== senderId));
      const newChat = {
        id: senderId,
        name: senderData.name,
        profilePicture: senderData.profilePicture || defaultProfilePicture,
      };

      setChats((prev) => [...prev, newChat]);

    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Decline a chat request
  const declineRequest = async (senderId) => {
    if (!currentUser) return;
    const currentUserRef = doc(db, 'users', currentUser.id);

    try {
      const updatedRequests = requests.filter((req) => req.senderId !== senderId);

      await updateDoc(currentUserRef, {
        chatRequests: updatedRequests,
      });

      setRequests(updatedRequests); // immediately update local state
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  // Navigate to a chat
  const handleChatClick = (otherUserId) => {
    if (!currentUser) return;
    const chatId = createChatId(currentUser.id, otherUserId);
    navigate(`/chat/${chatId}`);
  };

  // Delete a chat
  const handleDeleteChat = async (otherUserId) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.id);

      await updateDoc(userRef, {
        chats: chats.filter(chat => chat.id !== otherUserId).map(chat => chat.id),
      });

      setChats((prev) => prev.filter((chat) => chat.id !== otherUserId));
      setShowMenuFor(null); // Close menu after delete
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuFor(null); // Close the menu
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <p>Loading chats...</p>;
  if (!currentUser) return <p className="manage-chats-login">Please log in to view your chats.</p>;

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
          {requests.length > 0 && <span className="notification-badge">{requests.length}</span>}
        </button>
      </div>

      <div className="chat-list">
        {activeTab === 'chats' && (
          chats.length > 0 ? (
            chats.map(({ id, name, profilePicture }) => (
              <div key={id} className="chat-card">
                <img
                  src={profilePicture}
                  alt={`${name || 'User'}'s profile`}
                  className="manage-chats-profile-picture"
                  onClick={() => handleChatClick(id)}
                />
                <div className="chat-info" onClick={() => handleChatClick(id)}>
                  <div className="chat-name">{name || 'Unknown User'}</div>
                  <div className="chat-preview">Say hello and start chatting!</div>
                </div>

                {/* Three dots button */}
                <div className="chat-options">
                  <button className="options-button" onClick={() => setShowMenuFor(id)}>
                    <FiMoreHorizontal className="options-icon" />
                  </button>
                  {showMenuFor === id && (
                    <div className="options-menu" ref={menuRef}>
                      <button className="delete-option" onClick={() => handleDeleteChat(id)}>
                        <FaTrash /> Delete Conversation
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <img src={emptyChat} alt="No chats" className="empty-image" />
              <p>No existing chats. Find partners to start chatting!</p>
            </div>
          )
        )}

        {activeTab === 'requests' && (
          requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.senderId} className="chat-card request-card">
                <img
                  src={req.profilePicture}
                  alt={`${req.senderName || 'User'}'s profile`}
                  className="manage-chats-profile-picture"
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
            <div className="empty-state">
              <img src={emptyChat} alt="No requests" className="empty-image" />
              <p>No pending chat requests.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ManageChats;