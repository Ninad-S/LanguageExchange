// Nasir Johnson
import React, { useEffect, useState } from 'react';
import './Pricing.css';
import { useNavigate } from "react-router-dom";
import { payments } from '../firebase';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snapshot = await payments.listProducts();
        setPlans(snapshot);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const planCards = [
    { id: 'free_plan', className: 'plan-card1' },
    { id: 'basic_plan', className: 'plan-card2' },
    { id: 'premium_plan', className: 'plan-card3' }
  ];

  const handlePlanSelect = (plan) => {
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null); // 🔁 Unselect if same plan is clicked again
    } else {
      setSelectedPlan(plan);
      setError('');
    }
  };
  
  const handleProceed = () => {
    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }
    navigate(`/checkout?plan=${selectedPlan.id}`);
  };

  if (loading) return <div>Loading plans...</div>;

  const renderPlans = () => {
    const displayPlans = plans.length > 0 ? plans : [
      {
        id: 'free_plan',
        name: 'Free',
        description: 'Limited daily conversations\nLimited access to native speakers\nAds included',
        prices: [{ price: 0 }]
      },
      {
        id: 'basic_plan',
        name: 'Basic',
        description: '10 daily conversations\nAccess to 3 native speakers\nNo ads',
        prices: [{ price: 500 }]
      },
      {
        id: 'premium_plan',
        name: 'Premium',
        description: 'Unlimited conversations\nAccess to all native speakers\nPriority support',
        prices: [{ price: 1000 }]
      }
    ];

    return displayPlans.map((plan) => {
      const cardClass = planCards.find(p => p.id === plan.id)?.className || 'plan-card1';
      const isSelected = selectedPlan?.id === plan.id;
      return (
        <div
          key={plan.id}
          className={`${cardClass} ${isSelected ? 'selected' : ''}`}
          onClick={() => handlePlanSelect(plan)}
        >
          <h2>{plan.name}</h2>
          <p className="price">
            ${plan.prices[0].price / 100} / mo
          </p>
          <ul className="features">
            {plan.description.split('\n').map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="pricing-container">
      <div className="pricing-plans">
        {renderPlans()}
      </div>

      <div className="plan-actions">
        {error && <p className="error-message">{error}</p>}
        <button className="plan-button proceed-button" onClick={handleProceed}>
          Proceed to Checkout
        </button>
      </div>

      <footer className="footer">
        <p>LanguageMate | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Pricing;
