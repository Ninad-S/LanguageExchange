// src/pages/SignUp.js
//Ninad Sudarsanam
import React,{useState} from 'react';
//code to connect to firebase
import {auth, db} from './firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import{doc,setDoc} from 'firebase/firestore'
const langs = ['English', 'Spanish', 'German', 'French', 'Japanese', 'Chinese', 'Tamil', 'Hindi', 'Kannada'];
const SignUp = () => {
  //handle signup
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const[uid,setUID] = useState('')
  const[knownLangs,setKnownLangs] = useState([])
  const[learningLangs,setLearningLangs] = useState([])
  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      const userCred = await createUserWithEmailAndPassword(auth,email,password)
      const newUID = userCred.user.uid;  
      setUID(newUID);
      await setDoc(doc(db,'users',newUID), {
        id:uid,
        name: email.split('@')[0],
        knownLangs:[],
        learningLangs:[]
      })
    }catch(err){
      console.log(err)
    }
  }
  const handleLangSubmit = async (e)=>{
    try{
      await setDoc(doc(db,'users',uid), {
        id:uid,
        name: email.split('@')[0],
        knownLangs,
        learningLangs
      }, {merge:true})
      alert("User has been created successfully!")
    }
    catch(err)
    {
      console.error(err);
    }
  }
  const handleLangChange = (lang,type) => {
    const update = (arr,setArr) =>
      arr.includes(lang)
        ? setArr(arr.filter((l) => l !== lang)) : setArr([...arr,lang]);
        type === 'known' ? update(knownLangs, setKnownLangs) : update(learningLangs, setLearningLangs);
  }
  return (
    <div>
      {!uid ? (
        <>
          <h1>Sign Up</h1>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </>
      ) : (
        <>
          <h2>Select the languages you already know</h2>
          <form onSubmit={handleLangSubmit}>
            <div>
              <h3>Languages You Know</h3>
              {langs.map((lang) => (
                <div key={lang}>
                  <input
                    type="checkbox"
                    checked={knownLangs.includes(lang)}
                    onChange={() => handleLangChange(lang, 'known')}
                  />
                  <label>{lang}</label>
                </div>
              ))}
            </div>
            <div>
              <h3>Select the languages you are interested in learning</h3>
              {langs.map((lang) => (
                <div key={lang}>
                  <input
                    type="checkbox"
                    checked={learningLangs.includes(lang)}
                    onChange={() => handleLangChange(lang, 'learning')}
                  />
                  <label>{lang}</label>
                </div>
              ))}
            </div>
            <button type="submit">Submit Languages</button>
          </form>
        </>
      )}
    </div>
  );

};

export default SignUp;
