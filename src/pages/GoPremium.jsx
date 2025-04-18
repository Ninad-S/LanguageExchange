// Nasir Johnson
import React from 'react';
import '../Pricing.css';
import { Link } from "react-router-dom";

const Pricing = () => {
 

  return (

    <div className="pricing-container">
      
      <div className="pricing-plans">
        <div className="plan-card1">
          <h2>Free</h2>
          <p className="price">$0 / mo</p>
          <ul className="features">
            <li>Limited daily conversations</li>
            <li>Limited access to native speakers</li>
            <li>Ads included</li>
            <li>lefffr</li>
          </ul>
          <Link to="/checkout">
            <button className="plan-button">Button</button>
          </Link>
        </div>

        <div className="plan-card2">
          <h2>Basic</h2>
          <p className="price">$5 / mo</p>
          <ul className="features">
            <li>Limited daily conversations</li>
            <li>Limited access to native speakers</li>
            <li>Ads included</li>
            <li>lefffr</li>
          </ul>
          <Link to="/checkout">
            <button className="plan-button">Button</button>
          </Link>
        </div>

        <div className="plan-card3">
          <h2>Premium</h2>
          <p className="price">$10 / mo</p>
          <ul className="features">
            <li>Limited daily conversations</li>
            <li>Limited access to native speakers</li>
            <li>Ads included</li>
            <li>lefffr</li>
          </ul>
          <Link to="/checkout">
            <button className="plan-button">Button</button>
          </Link>
        </div>
      </div>

      <footer className="footer">
        <p>LanguageMate | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Pricing;
