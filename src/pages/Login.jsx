// src/pages/Login.jsx
import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <p>Welcome back! Please log in to continue.</p>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;