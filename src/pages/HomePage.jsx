import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import logo from '../assets/logo.png';
import logoText from '../assets/logo-text.png';
import './HomePage.css';

console.log("HomePage Component Loaded");

const HomePage = () => {
  console.log("Rendering HomePage Component");

  const user = auth.currentUser;
  const linkDestination = user ? "/find-partner" : "/signup";

    return (
        <div className="homepage-container">
            <div className="homepage-main-content">
                <img src={logo} className="homepage-logo" alt="LanguageMate"/>
                <img src={logoText} className="homepage-logo-text" alt="LanguageMate Text" />
                <div className="homepage-subtext">Learn Languages Together.</div>
                <Link to={linkDestination} className="homepage-start-learning-link">
                    Start Learning Now!
                </Link>
            </div>
        </div>
    );
};

export default HomePage;