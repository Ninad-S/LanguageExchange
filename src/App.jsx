import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import React, { useCallback } from "react";
import Header from "./components/Header";
import FindPartner from "./pages/FindPartner";
import ManageChats from "./pages/ManageChats";
import Chat from "./pages/Chat";
import LanguageQuiz from "./pages/LanguageQuiz";
import DiscussionBoard from "./pages/DiscussionBoard";
import Leaderboard from "./pages/Leaderboard";
import GoPremium from "./pages/GoPremium";
import SavedWords from "./pages/SavedWords";
import ProfileSetting from "./pages/ProfileSetting";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CheckoutPage from "./pages/CheckoutPage";
import ReturnPage from "./pages/ReturnPage";
import HomePage from "./pages/HomePage";

const stripePromise = loadStripe("pk_test_51REFy5BO4YYv1HibyNq4goyRpNeRYq2bEJKptkflwrzfYHjmcGLrGau3Zs0iYgyyd3pYWTsFP0hN7dxd77poNvzs00rUdgIyT3");

const App = () => {
  const appearance = { theme: "stripe" };

  const fetchClientSecret = useCallback(() => {
    return fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, []);

  const options = {
    fetchClientSecret,
    appearance,
  };

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header />
        <div style={{ flexGrow: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-partner" element={<FindPartner />} />
            <Route path="/manage-chats" element={<ManageChats />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/language-quiz" element={<LanguageQuiz />} />
            <Route path="/discussion-board" element={<DiscussionBoard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/go-premium" element={<GoPremium />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/return" element={<ReturnPage />} />
            <Route path="/saved-words" element={<SavedWords />} />
            <Route path="/profile-setting" element={<ProfileSetting />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
