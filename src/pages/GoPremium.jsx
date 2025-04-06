// Nasir Johnson
import React from 'react';
import '/Users/nasirjohnson/Projects/VSCode/LanguageExchange/src/Pricing.css';

const Pricing = () => {
  return (

    <div className="pricing-container">
      
      <div className="pricing-plans">
        <div className="plan-card">
          <h2>Free</h2>
          <p className="price">$0 / mo</p>
          <ul className="features">
            <li>Limited daily conversations</li>
            <li>Limited access to native speakers</li>
            <li>Ads included</li>
            <li>lefffr</li>
          </ul>
          <button className="plan-button">Button</button>
        </div>

        <div className="plan-card">
          <h2>Basic</h2>
          <p className="price">$5 / mo</p>
          <ul className="features">
            <li>Limited daily conversations</li>
            <li>Limited access to native speakers</li>
            <li>Ads included</li>
            <li>lefffr</li>
          </ul>
          <button className="plan-button">Button</button>
        </div>

        <div className="plan-card">
          <h2>Premium</h2>
          <p className="price">$10 / mo</p>
          <ul className="features">
            <li>Limited daily conversations</li>
            <li>Limited access to native speakers</li>
            <li>Ads included</li>
            <li>lefffr</li>
          </ul>
          <button className="plan-button">Button</button>
        </div>
      </div>

      <footer className="footer">
        <p>LanguageMate | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Pricing;
