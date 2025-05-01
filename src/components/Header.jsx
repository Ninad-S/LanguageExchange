import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import logoText from '../assets/logo-text.png';
import defaultProfile from '../pages/default-profile.png';
import './Header.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  // Example path groups:
  const languagePartnerPaths = ['/find-partner', '/manage-chats'];
  const learningTestingPaths = ['/language-quiz', '/saved-words'];
  const communityActivityPaths = ['/discussion-board', '/leaderboard'];
  const pricingPaths = ['/go-premium'];
  const accountPaths = ['/profile-setting'];


  const handleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };
  
  const handleMouseEnter = (index) => {
    setShowDropdown(index);
  };
  
  const handleMouseLeave = () => {
    setShowDropdown(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header>
      <nav className="header-nav">
        <div className="header-nav-left">
          <Link to="/">
            <img src={logo} className="header-logo" alt="LanguageMate" />
            <img src={logoText} className="header-logo-text" alt="LanguageMate Text" />
          </Link>
        </div>
        <div className="header-nav-menu">
          {/* Language Partners */}
          <div 
            className={`header-dropdown-wrapper ${isActive(languagePartnerPaths) ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(0)} 
            onMouseLeave={handleMouseLeave}
          >
            <button className="header-dropdown-button">
              Language Partners
            </button>
            {showDropdown === 0 && (
              <ul className="header-dropdown-menu show">
                <li><Link to="/find-partner">Find a Partner</Link></li>
                <li><Link to="/manage-chats">Chats</Link></li>
              </ul>
            )}
          </div>

          {/* Learning & Testing */}
          <div 
            className={`header-dropdown-wrapper ${isActive(learningTestingPaths) ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(1)} 
            onMouseLeave={handleMouseLeave}
          >
            <button className="header-dropdown-button">
              Learning & Testing
            </button>
            {showDropdown === 1 && (
              <ul className="header-dropdown-menu show">
                <li><Link to="/language-quiz">Language Quiz</Link></li>
                <li><Link to="/saved-words">Saved Words</Link></li>
              </ul>
            )}
          </div>

          {/* Community & Activity */}
          <div 
            className={`header-dropdown-wrapper ${isActive(communityActivityPaths) ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(2)} 
            onMouseLeave={handleMouseLeave}
          >
            <button className="header-dropdown-button">
              Community & Activity
            </button>
            {showDropdown === 2 && (
              <ul className="header-dropdown-menu show">
                <li><Link to="/discussion-board">Discussion Board</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
              </ul>
            )}
          </div>

          {/* Pricing */}
          <div 
            className={`header-dropdown-wrapper ${isActive(pricingPaths) ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(3)} 
            onMouseLeave={handleMouseLeave}
          >
            <button className="header-dropdown-button">
              Pricing
            </button>
            {showDropdown === 3 && (
              <ul className="header-dropdown-menu show">
                <li><Link to="/go-premium">Go Premium</Link></li>
              </ul>
            )}
          </div>

          {/* Account Area */}
          <div 
            className={`header-dropdown-wrapper ${isActive(accountPaths) ? 'active' : ''}`}
            onMouseEnter={() => handleMouseEnter(4)} 
            onMouseLeave={handleMouseLeave}
          >
            {user ? (
              <div className="header-user-dropdown">
                <img
                  src={defaultProfile}
                  className="header-account-picture"
                  alt="Profile"
                />
                {showDropdown === 4 && (
                  <ul className="header-dropdown-menu show">
                    <span className="header-user-email">{user.email}</span>
                    <li><Link to="/profile-setting">Profile Settings</Link></li>
                    <li><button onClick={handleLogout} className="header-logout-button">Logout</button></li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="header-auth-buttons">
                <Link to="/login" className="header-login-button">Sign in</Link>
                <Link to="/signup" className="header-signup-button">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;