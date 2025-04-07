// src/pages/Login.js
//Ninad Sudarsanam
import React,{useState} from 'react';
//code to connect to firebase
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
const Login = () => {
  //handle login
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const handleSubmit = async (e)=>{
      e.preventDefault()
      try{
        signInWithEmailAndPassword(auth,email,password)
        console.log("Sucessful")
      }catch(err){
        console.log(err)
      }
    }
  return (
    <div>
      <h1>Login</h1>
      <p>Welcome back! Please log in to continue.</p>
      <form onSubmit={handleSubmit}>
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
