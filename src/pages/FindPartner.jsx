import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Importing the Firestore instance
import './FindPartner.css';

const FindPartner = () => {
  // State to hold all users fetched from Firestore
  const [users, setUsers] = useState([]);
  
  // State to hold users that match the current user's language criteria
  const [matches, setMatches] = useState([]);
  
  // State to hold the current logged-in user (manually set for now)
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect to fetch all users from Firestore when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Get all documents from the 'users' collection
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        
        // Map the snapshot into an array of user data
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        console.log('Fetched users:', usersList); // Debug log
        setUsers(usersList);

        // Manually set the current user by ID
        const user = usersList.find(user => user.id === 'user1'); // Change this as needed for testing
        // const user = usersList.find(user => user.id === 'user4'); // Alternate test user
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  // useEffect to find language matches whenever currentUser or users list changes
  useEffect(() => {
    if (currentUser) {
      console.log('Current User:', currentUser); // Debug log

      // Function to find matching users based on language preferences
      const findMatches = (currentUser, usersList) => {
        const matches = usersList.filter(user => {
          // Exclude the current user from match results
          const isNotCurrentUser = user.id !== currentUser.id;

          // Check if the other user's known languages include a language the current user wants to learn
          const knownLanguageMatch = user.knownLanguages.some(lang => 
            currentUser.learningLanguages.includes(lang)
          );

          // Check if the other user is also learning a language the current user knows
          const learningLanguageMatch = user.learningLanguages.some(lang => 
            currentUser.knownLanguages.includes(lang)
          );

          // Debug logs for each user considered
          console.log(`Checking user ${user.id}:`);
          console.log('Known Languages:', user.knownLanguages);
          console.log('Learning Languages:', user.learningLanguages);
          console.log('isNotCurrentUser:', isNotCurrentUser);
          console.log('knownLanguageMatch:', knownLanguageMatch);
          console.log('learningLanguageMatch:', learningLanguageMatch);

          // Return true if all conditions for a match are met
          return isNotCurrentUser && knownLanguageMatch && learningLanguageMatch;
        });

        console.log('Matches found:', matches); // Debug log
        setMatches(matches);
      };

      // Run the match-finding function
      findMatches(currentUser, users);
    }
  }, [currentUser, users]);

  // Render the Find Partner page UI
  return (
    <div className="find-partner-container">
      <h1>Find Your Language Partner</h1>
      <p>These partners match your language preferences. Send a request to start chatting!</p>

      {/* Display matching users or a message if none found */}
      {matches.length > 0 ? (
        <div className="partner-list">
          {matches.map(match => (
            <div key={match.id} className="partner-card">
              <div className="partner-info">
                <h2>{match.name}</h2>
                <p><strong>Known Languages:</strong> {match.knownLanguages.join(', ')}</p>
                <p><strong>Target Languages:</strong> {match.learningLanguages.join(', ')}</p>
                <p>Body text for whatever you would like to say.</p>
              </div>
              <button className="chat-request-button">Send Chat Request</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No matches found. Please adjust your preferences.</p>
      )}
    </div>
  );
};

export default FindPartner;
