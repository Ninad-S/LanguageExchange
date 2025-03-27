// src/pages/SignUp.jsx
import React from 'react';

const SignUp = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <p>Create a new account to join LanguageMate.</p>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;