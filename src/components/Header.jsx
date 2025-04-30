// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd', fontFamily: "'Poppins', sans-serif" }}>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0, alignItems: 'center' }}>
          {/* Language Partners */}
          <li>
            <button 
              onClick={() => handleDropdown(0)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#333' }}
            >
              Language Partners
            </button>
            {showDropdown === 0 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none', fontSize: '15px', fontWeight: '400', borderRadius: '8px' }}>
                <li style={{ marginBottom: '8px' }}><Link to="/find-partner" style={{ textDecoration: 'none', color: '#333' }}>Find a Partner</Link></li>
                <li><Link to="/manage-chats" style={{ textDecoration: 'none', color: '#333' }}>Chats</Link></li>
              </ul>
            )}
          </li>

          {/* Learning & Testing */}
          <li>
            <button 
              onClick={() => handleDropdown(1)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#333' }}
            >
              Learning & Testing
            </button>
            {showDropdown === 1 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none', fontSize: '15px', fontWeight: '400', borderRadius: '8px' }}>
                <li style={{ marginBottom: '8px' }}><Link to="/language-quiz" style={{ textDecoration: 'none', color: '#333' }}>Language Quiz</Link></li>
                <li><Link to="/saved-words" style={{ textDecoration: 'none', color: '#333' }}>Saved Words</Link></li>
              </ul>
            )}
          </li>

          {/* Community & Activity */}
          <li>
            <button 
              onClick={() => handleDropdown(2)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#333' }}
            >
              Community & Activity
            </button>
            {showDropdown === 2 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none', fontSize: '15px', fontWeight: '400', borderRadius: '8px' }}>
                <li style={{ marginBottom: '8px' }}><Link to="/discussion-board" style={{ textDecoration: 'none', color: '#333' }}>Discussion Board</Link></li>
                <li><Link to="/leaderboard" style={{ textDecoration: 'none', color: '#333' }}>Leaderboard</Link></li>
              </ul>
            )}
          </li>

          {/* Pricing */}
          <li>
            <button 
              onClick={() => handleDropdown(3)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#333' }}
            >
              Pricing
            </button>
            {showDropdown === 3 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none', fontSize: '15px', fontWeight: '400', borderRadius: '8px' }}>
                <li><Link to="/go-premium" style={{ textDecoration: 'none', color: '#333' }}>Go Premium</Link></li>
              </ul>
            )}
          </li>

          {/* Account & Settings */}
          <li>
            <button 
              onClick={() => handleDropdown(4)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: '500', color: '#333' }}
            >
              Account & Settings
            </button>
            {showDropdown === 4 && (
              <ul style={{ position: 'absolute', backgroundColor: '#f9f9f9', padding: '10px', border: '1px solid #ccc', listStyle: 'none', fontSize: '15px', fontWeight: '400', borderRadius: '8px' }}>
                <li><Link to="/profile-setting" style={{ textDecoration: 'none', color: '#333' }}>Profile Setting</Link></li>
              </ul>
            )}
          </li>

          {/* Login / Logout */}
          <li style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            {user ? (
              <>
                <span style={{ fontSize: '14px', color: '#555' }}>👤 {user.email}</span>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#007bff', fontSize: '14px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', fontSize: '14px' }}>Login</Link>
                <Link to="/signup" style={{ textDecoration: 'none', color: '#007bff', fontSize: '14px' }}>Sign Up</Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
