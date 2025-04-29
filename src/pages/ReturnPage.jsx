import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReturnPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tier, setTier] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const sessionId = new URLSearchParams(location.search).get('session_id');

      if (!sessionId) {
        setError('No session_id provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4242/get-subscription-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });

        const data = await response.json();

        if (response.ok) {
          setTier(data.tier);
          localStorage.setItem('subscriptionTier', data.tier);
        } else {
          setError(data.error || 'Failed to fetch subscription status');
        }
      } catch (err) {
        console.error('Error fetching subscription status:', err);
        setError('Failed to fetch subscription status');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [location.search]);

  if (loading) return <div>Loading subscription status...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <div>
      <h1>Subscription Successful!</h1>
      <p>You are now on the <strong>{tier || localStorage.getItem(tier)}</strong> tier.</p>
      <button onClick={() => navigate('/go-premium')}>Back to Plans</button>
    </div>
  );
};

export default ReturnPage;
