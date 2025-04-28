import React, { useEffect, useState } from 'react';
import './Pricing.css';
import { useNavigate } from "react-router-dom";
import { payments, auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";


const Pricing = () => {
 const [plans, setPlans] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedPlan, setSelectedPlan] = useState(null);
 const [currentTier, setCurrentTier] = useState('free');
 const [isVerifying, setIsVerifying] = useState(false);
 const navigate = useNavigate();


 // Fetch current tier from Firestore
 const fetchCurrentTier = async () => {
   if (!auth.currentUser) {
     console.log("No authenticated user");
     return;
   }
  
   try {
     const userRef = doc(db, 'users', auth.currentUser.uid);
     const userDoc = await getDoc(userRef);
    
     if (!userDoc.exists()) {
       console.warn("User document doesn't exist");
       return;
     }
    
     const userData = userDoc.data();
     console.log("User document data:", userData);
    
     if (!userData.subscriptionTier) {
       console.warn("subscriptionTier field missing, defaulting to free");
     }
    
     const tier = userData.subscriptionTier || 'free';
     console.log("Current tier:", tier);
     setCurrentTier(tier);
   } catch (error) {
     console.error("Error fetching current tier:", error);
     setCurrentTier('free');
   }
 };


 useEffect(() => {
   const fetchData = async () => {
     try {
       const plansSnapshot = await payments.listProducts();
       setPlans(plansSnapshot);
       await fetchCurrentTier();
     } catch (error) {
       console.error("Error loading data:", error);
     } finally {
       setLoading(false);
     }
   };
  
   fetchData();
 }, []);


 const planCards = [
   { id: 'free_plan', className: 'plan-card1' },
   { id: 'basic_plan', className: 'plan-card2' },
   { id: 'premium_plan', className: 'plan-card3' }
 ];


 const handlePlanSelect = (plan) => {
   console.log("Selected plan:", plan.id);
   console.log("Current tier:", currentTier);
  
   const currentTierPlanId = `${localStorage.getItem('subscriptionTier')}_plan`;
  
   if (plan.id === currentTierPlanId) {
     console.log("User selected their current tier");
     return;
   }
  
   setSelectedPlan(prevSelected => 
    prevSelected?.id === plan.id ? null : plan
  );
 };


 const handleProceed = async () => {
   if (!selectedPlan) {
     console.warn("No plan selected");
     return;
   }
    setIsVerifying(true);
    try {
     const currentUser = auth.currentUser;
     if (!currentUser) {
       alert("You must be logged in to upgrade.");
       return;
     }
      await currentUser.reload();
     const userEmail = currentUser.email;
     if (!userEmail) {
       throw new Error('User email not found');
     }
      const priceIdMap = {
       basic_plan: 'price_1RHUa1BO4YYv1HibuAiMdNym',
       premium_plan: 'price_1RHoneBO4YYv1HibuiT3xavV',
       free_plan: 'price_1RHpkQBO4YYv1HibThecfkw3',
     };
      const response = await fetch('http://localhost:4242/create-checkout-session', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         price_id: priceIdMap[selectedPlan.id],
         uid: currentUser.uid,
         email: userEmail
       })
     });


     if (!response.ok) {
       const errorData = await response.json();
       throw new Error(errorData.error || 'Payment failed');
     }
      const { clientSecret } = await response.json();
     navigate(`/checkout?plan=${selectedPlan.id}&session_secret=${clientSecret}`);
   } catch (error) {
     console.error("Checkout error:", error);
     alert(`Checkout failed: ${error.message}`);
   } finally {
     setIsVerifying(false);
   }
 };


 const currentTierPlanId = `${localStorage.getItem('subscriptionTier')}_plan`;
 const isValidSelection = selectedPlan && selectedPlan.id !== currentTierPlanId;


 if (loading) {
   return (
     <div className="loading-container">
       <div className="loading-spinner"></div>
       <p>Loading plans...</p>
     </div>
   );
 }


 const renderPlans = () => {
   const displayPlans = plans.length > 0 ? plans : [
     {
       id: 'free_plan',
       name: 'Free',
       description: '3 language partners\nBasic features\nAds included',
       prices: [{ price: 0 }]
     },
     {
       id: 'basic_plan',
       name: 'Basic',
       description: '10 language partners\nAd-free experience',
       prices: [{ price: 500 }]
     },
     {
       id: 'premium_plan',
       name: 'Premium',
       description: 'Unlimited partners\nPriority support',
       prices: [{ price: 1000 }]
     }
   ];


   return displayPlans.map((plan) => {
     const cardClass = planCards.find(p => p.id === plan.id)?.className || 'plan-card1';
     const isCurrent = plan.id === `${localStorage.getItem('subscriptionTier')}_plan`;
     const isSelected = selectedPlan?.id === plan.id;


     return (
       <div
         key={plan.id}
         className={`${cardClass} ${isCurrent ? 'current-tier' : ''} ${isSelected ? 'selected' : ''}`}
         onClick={() => handlePlanSelect(plan)}
         style={{ cursor: isCurrent ? 'default' : 'pointer' }}
       >
         {isCurrent && <div className="current-badge">Current Plan</div>}
         <h2>{plan.name}</h2>
         <p className="price">
           ${plan.prices[0].price / 100} {plan.id === 'free_plan' ? '' : '/ mo'}
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


     <div className="current-tier-banner">
       You are currently on the <strong>{localStorage.getItem('subscriptionTier')}</strong> plan.
     </div>
     <div className="pricing-plans">
       {renderPlans()}
     </div>


     <div className="plan-actions">
       <button
         className={`proceed-button ${!isValidSelection ? 'disabled' : ''}`}
         onClick={handleProceed}
         disabled={!isValidSelection || isVerifying}
       >
         {isVerifying ? (
           <>
             <span className="spinner"></span> Processing...
           </>
         ) : (
           'Proceed to Checkout'
         )}
       </button>
     </div>


     <footer className="footer">
       <p>LanguageMate | Privacy Policy</p>
     </footer>
   </div>
 );
};


export default Pricing;
