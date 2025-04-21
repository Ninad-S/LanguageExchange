import React, { useEffect, useState } from 'react';
import './Subscription.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { loadStripe } from '@stripe/stripe-js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_stripe_publishable_key');

// Stripe Payment Form
const StripePaymentForm = ({ plan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: auth.currentUser?.email || '',
    address: { line1: '', city: '', postal_code: '', country: 'US' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: formData.name,
          email: formData.email,
          address: formData.address
        }
      });

      if (error) throw error;

      const token = await auth.currentUser.getIdToken();
      const response = await fetch('https://your-firebase-function-url/createSubscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethodId: paymentMethod.id,
          email: formData.email
        })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      onSuccess();
    } catch (err) {
      console.error("Payment error:", err);
      onError(err.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {['name', 'email'].map((field) => (
        <div className="form-group" key={field}>
          <label>{field === 'name' ? 'Full Name' : 'Email'}</label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div className="form-group">
        <label>Street Address</label>
        <input
          type="text"
          name="address.line1"
          value={formData.address.line1}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        {['city', 'postal_code'].map((field) => (
          <div className="form-group" key={field}>
            <label>{field === 'postal_code' ? 'ZIP Code' : 'City'}</label>
            <input
              type="text"
              name={`address.${field}`}
              value={formData.address[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Card Details</label>
        <div className="stripe-card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' }
                },
                invalid: { color: '#9e2146' }
              }
            }}
          />
        </div>
      </div>

      <button type="submit" disabled={processing || !stripe} className="subscribe-button">
        {processing ? 'Processing...' : `Subscribe for $${plan.prices[0].unit_amount / 100}/${plan.prices[0].interval}`}
      </button>
    </form>
  );
};

// Main Checkout Page
const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const planColors = {
    free_plan: '#b86bb9',
    basic_plan: '#283B66',
    premium_plan: '#8391AE'
  };

  useEffect(() => {
    const loadPlan = async () => {
      const planId = new URLSearchParams(location.search).get('plan');
      if (!planId) return navigate('/go-premium');

      try {
        const planRef = doc(db, 'products', planId);
        const planSnap = await getDoc(planRef);

        if (!planSnap.exists()) throw new Error('Plan not found');

        const pricesSnap = await getDocs(collection(db, 'products', planId, 'prices'));
        const prices = pricesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (!prices.length) throw new Error('No prices available for this plan');

        setPlan({
          id: planSnap.id,
          ...planSnap.data(),
          prices,
          color: planColors[planId] || '#8391AE'
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
        navigate('/go-premium');
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [location.search, navigate]);

  if (loading) {
    return (
      <div className="subscription-container">
        <div className="loading-spinner"></div>
        <p>Loading plan details...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="subscription-container">
        <div className="error-message">
          <h2>Plan not found</h2>
          <p>{error || "The selected plan could not be loaded"}</p>
          <button className="back-button" onClick={() => navigate('/go-premium')}>
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-container">
      <div className="subscription-header">
  <button className="back-button" onClick={() => navigate('/go-premium')}>
    ← Back to Plans
  </button>
  <h1>Your Subscription</h1>
</div>

      <div className="form-layout">
        <div className="subscription-card" style={{ backgroundColor: plan.color }}>
          <div className="plan-section">
            <h2>{plan.name}</h2>
            <p className="price">
              ${plan.prices[0].unit_amount / 100} / {plan.prices[0].interval}
            </p>
            <ul className="features">
              {plan.description.split('\n').map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        </div>

        <div className="payment-container">
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              plan={plan}
              onSuccess={() => navigate('/payment-success')}
              onError={(msg) => setError(msg)}
            />
          </Elements>

          {error && <div className="error-message"><p>{error}</p></div>}
        </div>
      </div>

      <div className="billing-details">
        <p>
          <strong>Billing Details:</strong><br />
          By clicking Subscribe, you agree to our Terms of Service and Privacy Policy.
          You'll be charged ${plan.prices[0].unit_amount / 100} per {plan.prices[0].interval}.
          Cancel anytime from your account settings.
        </p>
      </div>

      <footer className="footer">
        <span>LanguageMate</span> | <span>Privacy Policy</span> | <span>Terms</span>
      </footer>
    </div>
  );
};

export default CheckoutPage;