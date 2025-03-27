// src/components/Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(null);

  const handleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  return (
    <header style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 }}>
          {/* Language Partners */}
          <li>
            <button onClick={() => handleDropdown(0)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Language Partners
            </button>
            {showDropdown === 0 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none' }}>
                <li><Link to="/find-partner">Find a Partner</Link></li>
                <li><Link to="/chat">Chat</Link></li>
              </ul>
            )}
          </li>

          {/* Learning & Testing */}
          <li>
            <button onClick={() => handleDropdown(1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Learning & Testing
            </button>
            {showDropdown === 1 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none' }}>
                <li><Link to="/language-quiz">Language Quiz</Link></li>
              </ul>
            )}
          </li>

          {/* Community & Activity */}
          <li>
            <button onClick={() => handleDropdown(2)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Community & Activity
            </button>
            {showDropdown === 2 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none' }}>
                <li><Link to="/discussion-board">Discussion Board</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
              </ul>
            )}
          </li>

          {/* Pricing */}
          <li>
            <button onClick={() => handleDropdown(3)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Pricing
            </button>
            {showDropdown === 3 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none' }}>
                <li><Link to="/go-premium">Go Premium</Link></li>
              </ul>
            )}
          </li>

          {/* Account & Settings */}
          <li>
            <button onClick={() => handleDropdown(4)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Account & Settings
            </button>
            {showDropdown === 4 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none' }}>
                <li><Link to="/profile-setting">Profile Setting</Link></li>
              </ul>
            )}
          </li>

          {/* Login / Sign Up */}
          <li style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;