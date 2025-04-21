// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/find-partner" element={<FindPartner />} />
        <Route path="/manage-chats" element={<ManageChats />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/language-quiz" element={<LanguageQuiz />} />
        <Route path="/discussion-board" element={<DiscussionBoard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/go-premium" element={<GoPremium />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/saved-words" element={<SavedWords />} />
        <Route path="/profile-setting" element={<ProfileSetting />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
