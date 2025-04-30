import React from 'react';
import { Link } from 'react-router-dom'; // ? Make sure this is installed
import logo from '../assets/logo.png';
import logoText from '../assets/logo-text.png';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage-container">
            <div className="homepage-main-content">
                <img src={logo} className="homepage-logo" alt="LanguageMate"/>
                <img src={logoText} className="homepage-logo-text" alt="LanguageMate Text" />
                <div className="homepage-subtext">Learn Languages Together.</div>
                <Link to="/signup" className="homepage-start-learning-link">
                    Start Learning Now!
                </Link>
            </div>
        </div>
    );
};

export default HomePage;
