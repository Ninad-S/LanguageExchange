// src/pages/SignUp.js
//Ninad Sudarsanam
import React,{useState} from 'react';
//code to connect to firebase
import {auth} from '../firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
const SignUp = () => {
  //handle signup
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      createUserWithEmailAndPassword(auth,email,password)
      console.log("Sucessful")
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div>
    
      <h1>Sign Up</h1>
      <p>Create a new account to join LanguageMate.</p>
      <form className='signup-form' onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" onChange={(e)=> setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" onChange={(e)=> setPassword(e.target.value)}/>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
