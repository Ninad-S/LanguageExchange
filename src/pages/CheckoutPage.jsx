import React, { useState, useEffect } from 'react';
import './Subscription.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51REFy5BO4YYv1HibyNq4goyRpNeRYq2bEJKptkflwrzfYHjmcGLrGau3Zs0iYgyyd3pYWTsFP0hN7dxd77poNvzs00rUdgIyT3');

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionSecret = query.get('session_secret');

    if (!sessionSecret) {
      navigate('/go-premium');
      return;
    }

    setClientSecret(sessionSecret);
    setLoading(false);
  }, [location, navigate]);

  if (loading) return <div>Loading checkout...</div>;

  return (
    <div
      className="subscription-container"
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );

};

export default CheckoutPage;
