// src/pages/LanguageQuiz.jsx
//Language Quiz implementation by Maggie Buvanendiran
import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';

//This holds the primary working code where the language quiz will show up on the front end.
const LanguageQuiz = () => {
  //set the counter for the variable that keeps track of the current question aand sets it to the default number of 0
  const [currentQuestion, setCurrentQuestion] = useState(0)
  //assigns the variable for the selected answer and sets the state of the ariables as blank
  const [selectedAnswer, setSelectedAnswer] = useState('')
  //assigns variables for the results, including the score, correct and incorrect answers set to the default count of 0
  const [result, setResult] = useState({
    finalScore: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
  })
  const [showFinalResult, setShowFinalResult] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [color, setColor] = useState("grey");

  //uses the getQuestions function to receive questions from the database to be used in the quiz
  //assigns a question in random order into the quiz along with the answers.
  /*const quiz = {
    questions: [
      {
        question: 'pick 2?',
        answers: ['1', '2', '3', '4'],
        answerKey: '2',
        questionType: 'MCQ'
      },
      {
        question: 'say hello!',
        answers: ['hello'],
        answerKey: 'hello',
        questionType: 'short answer'
      }
    ],
  }*/
  
  const [questions, setQuestions] = useState([]);
  const getQuestions = async () => {
    //imports all questions from the database
    await getDocs(collection(db, "question"))
    .then((QuerySnapshot)=>{
      const newData = querySnapshot.getDocs
      .map((doc) => ({...doc.data(), id:doc.id }));
      setQuestions(newData);
      console.log(questions, newData);
    })
    //assigns them to an array to be received  and then assigned to a set number of quizzes 

  }

  useEffect(()=>{
    getQuestions();
  }, [])

  //function that receives the answer key from the database
  //const { question, answers, answerKey, questionType } = questions[currentQuestion];
  const [answerKey, setAnswerKey] = useState([]);
  const getAnswers = async () => {
    //imports answers from the database
    await getDocs(collection(db, "answerKey"))
    .then((QuerySnapshot)=>{
      const newData = querySnapshot.getDocs
      .map((doc) => ({...doc.data(), id:doc.id }));
      setAnswerKey(newData);
      console.log(answerKey, newData);
    })
    //maps each question with it's respective answers to generate the multiple choice answers to 

    useEffect(()=>{
      setAnswerKey();
    }, [])
  }

  //function that lets user move on to the next question
  const nextButton = () => {
    //move to the next question
    setCurrentQuestion((prev) => prev + 1)
    //record answer in records

    //show a new question and answers
    
  }

  //function that validates if the user's input is correct
  const checkAnswer = () => {
    //compare user picked answer and actual answer
    if(answer === answerKey){
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
    //if answer is correct, count question correct, else count it incorrect

  }

  //function that will show the total number of questions on the quiz.
  const showTotalQuestions = () => {
    //ask user how many questions

    //give user the option of 3, 5 or 7 questions

    //return the number of questions to use for the quiz

  }

  //function to calculate final score
  const calcFinalScore = () => {
    //get final score

    //divide by total number of questions

    //multiply by 100 to get final percentage

    //gather all  questions and assign them a  color

    //if correct, assign them green

    //else, assign them red
  }

  //function to store the results of this quiz in the search database
  const getQuizResults = () => {
    //get final score, correct questions and incorrect questions along with their answers
    if(currentQuestion + 1 === 2){
      
    }
    //import it to the database under the 
  }

  //function to compile all the quizzes taken into the database 
  const compileQuizzes = () => {
    //get all dates and IDs of quizzes taken

    //import to the database

    //create a list of all the imports
  } 

  //function to search the quiz results 
  const searchResults = () => {
    //get user input for the date

    //get the user input for the quiz number

    //filter the list with the user inputs

    //return the results filtered from the list
  }

  //shows what will be output on the front end of the website
  return (
    //Holds the container for the quiz to be shown in, it shows the Question, the answers and the total number of quiz questions with the back and forth button
    //There are placeholders currently set for the question, the answer choices and the answer  along with the max number of questions to be received from the database  
    //There is also the Quiz results shown after the quiz is taken to show the resulting score an which questions are correct and incorrect
    <div className='quiz'>
    {!showFinalResult ? (
      <div>
        <h1>Language Quiz</h1>
        <div>
          <h2> {question} </h2>
          {questionType === 'MCQ' ? (
          <ul>
            {answers.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  color === "grey"
                  setSelectedAnswer(item)
                  setSelectedAnswerIndex(index)
                }}
              >
                {item}
              </button>
            ))}
          </ul>
          ) : (
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer"
            />
          )}
          <button onClick={nextButton}> Next </button>
        </div>
        <div className='index'> {currentQuestion + 1} of 2</div>
      </div>
    ) : (
      <div className='results'>
        <h2>Quiz Results</h2>
        <p> Your score: {finalScore} points</p>
      </div>
    )}
  </div>
)
};

export default LanguageQuiz;
