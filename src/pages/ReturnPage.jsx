import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Make sure this import exists
import { doc, getDoc } from "firebase/firestore";
import './ReturnPage.css';

const ReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tier, setTier] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [firestoreReady, setFirestoreReady] = useState(false);

  // Check Firestore connection first
  useEffect(() => {
    const verifyFirestore = async () => {
      try {
        if (!db) throw new Error("Firestore not initialized");
        
        // Test connection with a dummy read
        await getDoc(doc(db, 'test', 'test'));
        setFirestoreReady(true);
      } catch (err) {
        console.error("Firestore connection error:", err);
        setError("Database connection failed. Please refresh.");
        setLoading(false);
      }
    };

    verifyFirestore();
  }, []);

  useEffect(() => {
    if (!firestoreReady) return;

    const fetchSubscriptionStatus = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');

      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        // First verify with Stripe
        const stripeResponse = await fetch('http://localhost:4242/get-subscription-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });

        const stripeData = await stripeResponse.json();

        if (!stripeResponse.ok) {
          throw new Error(stripeData.error || 'Stripe verification failed');
        }

        // Then update Firestore
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { 
            subscriptionTier: stripeData.tier 
          }, { merge: true });
        }

        setTier(stripeData.tier);
        localStorage.setItem('subscriptionTier', stripeData.tier);
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [location.search, firestoreReady]);

  if (!firestoreReady && !error) {
    return (
      <div className="return-container loading">
        <div className="spinner"></div>
        <p>Connecting to database...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="return-container loading">
        <div className="spinner"></div>
        <p>Verifying your subscription...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="return-container error">
        <h2>Verification Failed</h2>
        <p>{error}</p>
        <button 
          className="action-button"
          onClick={() => window.location.reload()} // Full reload to reinitialize Firebase
        >
          Try Again
        </button>
        <button 
          className="action-button secondary"
          onClick={() => navigate('/go-premium')}
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="return-container success">
      <div className="success-icon">✓</div>
      <h2>Payment Successful</h2>
      <p>We've emailed your receipt and subscription details.</p>
      <div className="tier-update">
        <p>Your new plan:</p>
        <div className="tier-badge">{tier}</div>
      </div>
      <button 
        className="action-button"
        onClick={() => navigate('/app')} // Send to app instead of plans
      >
        Start Using Your Plan
      </button>
    </div>
  );
};

export default ReturnPage;