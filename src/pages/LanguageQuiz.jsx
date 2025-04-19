// src/pages/LanguageQuiz.jsx
// Language Quiz implementation by Maggie Buvanendiran

import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

// This holds the primary working code where the language quiz will show up on the front end.
const LanguageQuiz = () => {
  // set the counter for the variable that keeps track of the current question and sets it to the default number of 0
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // assigns the variable for the selected answer and sets the state of the variables as blank
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  // assigns variable for answer key to compare answer to and see if it is correct
  const [answerKeyMap, setAnswerKeyMap] = useState({});

  // assigns variables for the results, including the score, correct and incorrect answers set to the default count of 0
  const [result, setResult] = useState({
    finalScore: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
  });

  // variable to show the final result for the search
  const [showFinalResult, setShowFinalResult] = useState(false);

  // uses the getQuestions function to receive questions from the database to be used in the quiz
  // assigns a question in random order into the quiz along with the answers.
  const getQuestions = async () => {

  };

  useEffect(() => {
    getQuestions();
  }, []);

  // maps each question with its respective answers to generate the multiple choice answers to
  const getAnswers = async () => {

  };

  useEffect(() => {
    getAnswers();
  }, []);

  // function that validates if the user's input is correct
  const checkAnswer = () => {
    const current = questions[currentQuestion];
    const correctAnswer = answerMap[currentQ?.id]?.toLowerCase().trim();
    const userAnswer = selectedAnswer.toLowerCase().trim();

    // compare user picked answer and actual answer
    if (userAnswer === correctAnswer) {
      setResult((prev) => ({
        ...prev,
        finalScore: prev.finalScore + 1,
        correctAnswers: prev.correctAnswers + 1,
      }));
    } else {
      setResult((prev) => ({
        ...prev,
        incorrectAnswers: prev.incorrectAnswers + 1,
      }));
    }
  };

  // function that lets user move on to the next question
  const nextButton = () => {
    // record and validate answer
    checkAnswer();

    // reset answer input
    setSelectedAnswer('');
    setSelectedAnswerIndex(null);

    // move to the next question or finish quiz
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowFinalResult(true); // end of quiz
    }
  };

  // function that will show the total number of questions on the quiz.
  const showTotalQuestions = () => {
    // ask user how many questions

    // give user the option of 3, 5 or 7 questions

    // return the number of questions to use for the quiz
  };

  // function to calculate final score
  const calcFinalScore = () => {
    // get final score

    // divide by total number of questions

    // multiply by 100 to get final percentage

    // gather all questions and assign them a color

    // if correct, assign them green

    // else, assign them red
  };

  // function to store the results of this quiz in the search database
  const getQuizResults = () => {
    // get final score, correct questions and incorrect questions along with their answers
    if (currentQuestion + 1 === 2) {
      // placeholder
    }
    // import it to the database under the collection
  };

  // function to compile all the quizzes taken into the database
  const compileQuizzes = () => {
    // get all dates and IDs of quizzes taken

    // import to the database

    // create a list of all the imports
  };

  // function to search the quiz results
  const searchResults = () => {
    // get user input for the date

    // get the user input for the quiz number

    // filter the list with the user inputs

    // return the results filtered from the list
  };

  // extract the current question and its fields from the array safely
  const current = questions[currentQuestion];
  const question = current?.question;
  const answers = current?.answers || [];
  const questionType = current?.questionType;

  // shows what will be output on the front end of the website
  // holds the container for the quiz to be shown in. It shows the Question, the answers, and the total number of quiz questions with the back and forth button
  // There are placeholders currently set for the question, the answer choices and the answer along with the max number of questions to be received from the database  
  // There is also the Quiz results shown after the quiz is taken to show the resulting score and which questions are correct and incorrect
  return (
    <div className='quiz'>
      {!showFinalResult ? (
        <div>
          <h1>Language Quiz</h1>
          <div>
            <h2>{question}</h2>
            {questionType === 'MCQ' ? (
              <ul>
                {answers.map((item, index) => (
                  <button
                    key={index}
                    style={{
                      backgroundColor:
                        selectedAnswerIndex === index ? '#cde' : '#eee',
                      margin: '5px',
                      padding: '10px',
                    }}
                    onClick={() => {
                      setSelectedAnswer(item);
                      setSelectedAnswerIndex(index);
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
            <button onClick={nextButton} style={{ marginTop: '15px' }}>
              Next
            </button>
          </div>
          <div className='index'>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      ) : (
        <div className='results'>
          <h2>Quiz Results</h2>
          <p>Your score: {result.finalScore} / {questions.length}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
          <p>Incorrect Answers: {result.incorrectAnswers}</p>
        </div>
      )}
    </div>
  );
};

export default LanguageQuiz;
