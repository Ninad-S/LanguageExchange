import React from 'react';
import '/Users/nasirjohnson/Projects/VSCode/LanguageExchange/src/pages/Subscription.css';



const SubscriptionForm = () => {
  return (
    <div className="subscription-container">
      <h1>Your Subscription</h1>
      
      <div className="form-layout">
        {/* Compact Subscription Card */}
        <div className="subscription-card">
          <div className="plan-section">
            <h2>Premium</h2>
            <p className="price">$9.99 / mo</p>
            <ul className="features">
              <li>Lorem ipsum dolor sit amet</li>
              <li>Lorem ipsum dolor sit amet</li>
              <li>Lorem ipsum dolor sit amet</li>
              <li>Lorem ipsum dolor sit amet</li>
              <li>Lorem ipsum dolor</li>
              <li>Lorem ipsum dolor</li>
            </ul>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form">
          <div className="payment-methods">
            <div className="payment-method">
              <h3>VISA</h3>
              <div className="form-group">
                <label>Name on card</label>
                <input type="text" placeholder="Name" />
              </div>
              <div className="form-group">
                <label>Exp. month</label>
                <input type="text" placeholder="Month" />
              </div>
              <div className="form-group">
                <label>Zip postal code</label>
                <input type="text" placeholder="Postal Code" />
              </div>
            </div>
            
            <div className="payment-method">
              <h3>PayPal</h3>
              <div className="form-group">
                <label>Card number</label>
                <input type="text" placeholder="Card Number" />
              </div>
              <div className="form-group">
                <label>Exp. year</label>
                <input type="text" placeholder="Year" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" placeholder="Country" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>
      
      <button className="subscribe-button">Subscribe</button>
      
      <div className="billing-details">
        <p>
          <strong>Billing Details:</strong><br />
          By clicking Purchase you are agreeing to our LanguageMate Terms, LanguageMate Terms of Use, 
          Privacy Policy and for LanguageMate to charge your payment method for $9.99 (+ tax if applicable) 
          for your monthly subscription to LanguageMate. LanguageMate will automatically charge your 
          payment method monthly until you elect to cancel by selecting cancel membership in My Account.
        </p>
      </div>
      
      <div className="divider"></div>
      
      <footer className="footer">
        <span>LanguageMate</span> | <span>Privacy Policy</span>
      </footer>
    </div>
  );
};

export default SubscriptionForm;
