// src/pages/LanguageQuiz.jsx
// Language Quiz implementation by Maggie Buvanendiran

import React, { useEffect, useState } from 'react';
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { doc, updateDoc, getDoc, collection } from 'firebase/firestore';
import { app, db, auth } from '../firebase';


// This holds the primary working code where the language quiz will show up on the front end.
const LanguageQuiz = () => {
  // set the counter for the variable that keeps track of the current question and sets it to the default number of 0
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // assigns the variable that keeps track of the user's selected answer and sets the state of the variables as blank
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

  // variable to take account of new set of questions
  const [newQuestions, setNewQuestions] = useState([]);

  //import user's language preferences to generate questions for the quiz
  const [LanguagePrefs, setLanguagePrefs] = useState([]);

  //extracts the user language preference data from the database to be used in determining quiz questions
  useEffect(() => {
    const getUserLanguage = async () => {
      const user = auth.currentUser;
      if(user) {
        //define cloud firestore database to get the user language preferences
        const userRef = doc(db, 'users', user.uid);
        //snapshot of user data assigned
        const userSnap = await getDoc(userRef);
        //checks if data in the snapshot exists to set the langugae preferences for the quiz questions
        if(userSnap.exists()) {
          const data = userSnap.data();
          setLanguagePrefs(data.LanguagePrefs || []);
        }
      }
    };
    getUserLanguage();
  }, []);

  //import words from saved word bank to be used in quiz
  useEffect(() => {
    const db = getDatabase(app); 
    const wordsRef = ref(db, 'savedUsers/testuser'); 

    onValue(wordsRef, (snapshot) => {
      // get the data object
      const data = snapshot.val(); 
      // check if there's data in the database
      if (data) {
        // convert word objects to array
        const words = Object.values(data);

        //convert the word objects into questions to be stored in the db
        const wordToQuestion = words.map((item) => ({
          question: item.word,
          answerKey: item.translation,
          questionType: "Short Answer",
          qLang: item.language,
        }));
        // save to state
        setNewQuestions(wordToQuestion);
      }
    });
  }, []);

  //combines the saved word questions to the quiz question list
  useEffect(() => {
    setQuestions((prev) => [...prev, ...newQuestions].sort(() => Math.random() - 0.5));
  }, [newQuestions]);

  // uses the function to receive questions and answers from the database to be used in the quiz
  // assigns a question in random order into the quiz along with the answers.
  useEffect(() => {
    //connect to database to get data 
    const db = getDatabase(app); 
    const questionsRef = ref(db, 'questions'); 
  
    // fetch and listen to changes in the "questions" node
    onValue(questionsRef, (snapshot) => {
      // get the data object
      const data = snapshot.val(); 
      // check if there's data in the database
      if (data) {
        // convert object to array
        const totalQ = Object.values(data);
        // filter by the language preferences
        const filteredQuestions = totalQ.filter(question => 
          LanguagePrefs.includes(question.qLang) 
        );
        // shuffle the questions so they will be randomly given
        const shuffle = totalQ.sort(() => Math.random() - 0.2);
        // save to state
        setQuestions(shuffle); 
      }
    });
  }, [LanguagePrefs]);

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
  
  // function that validates if the user's input is correct
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [correct, setCorrect] = useState(false); ;
  const checkAnswer = () => {
    const current = questions[currentQuestion];
    //checks correct answer for both mcq's and short answer questions by lowercasing the answer
    const correctAnswer = current?.answerKey?.toLowerCase().trim();
    //checks user answers for short answers by lowercasing all user inputs
    const userAnswer = selectedAnswer.toLowerCase().trim();   

    //sets constant to reaad in comparison 
    const answerCorrect = userAnswer === correctAnswer;
  
    //set the answer as 
    setCorrect(answerCorrect);

    //sets the array to display the user's answered questions
    setAnsweredQuestions((prev) => [
      ...prev,
      {
        question: current.question,
        correctAnswer: current.answerKey,
        userAnswer: selectedAnswer,
        correct: answerCorrect,
      },
    ]);

     // compare user picked answer with correct answer
    // gather all questions and assign them a color
    // if correct, assign them green
    // else, assign them red
    if (answerCorrect) {
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

  // function that resets quiz 
  const resetQuiz = () => {
    // sets final result page to not be shown
    setShowFinalResult(false); 
    // resets question counter       
    setCurrentQuestion(0);     
    // resets results 
    setResult({                        
      finalScore: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    });
    // resets selected answers to empty          
    setSelectedAnswer('');   
    // resets answered question counter to 0        
    setSelectedAnswerIndex(null); 
    // rsets answered questions backl to default
    setAnsweredQuestions([]);
    // resets correct constant
    setCorrect(false);
  }

  // function to calculate final score
  const calcFinalScore = () => {
    // divide by total number of questions
    // multiply by 100 to get final percentage
    return ((result.finalScore/questions.length) * 100);
  };

  // function to compile all the quizzes taken into the database
  const compileQuizzes = () => {
    // import to the database
    const db = getDatabase(app); 
    const resultsRef = ref(db, 'quizResults');
    const newResultsRef = push(resultsRef);
    // get all dates, IDs, and corrrect and incorrect answers of quizzes taken
    set(newResultsRef, {
      date: new Date().toLocaleString(),
      finalScore: calcFinalScore(),
      correctAnswers: result.correctAnswers,
      incorrectAnswers: result.incorrectAnswers,
    })
  };

  // search input variables
  const [searchInput, setSearchInput] = useState("");
  //search results in full of the entire results
  const [searchResults, setSearchResult] = useState([]);
  //filtered query results
  const [searchQuery, setSearchQuery] = useState([]);
  
  // function to store the results of this quiz in the search database
  // get final score, correct questions and incorrect questions along with their answers
  // import it to the database under the collection
  useEffect(() => {
    //connect to database to get data 
    const db = getDatabase(app); 
    const resultsRef = ref(db, 'quizResults');
  
    // fetch and listen to changes in the "questions" node
    onValue(resultsRef, (snapshot) => {
      // get the data object
      const data = snapshot.val(); 
      // check if there's data in the database
      if (data) {
        // convert object to array for results
        const results = Object.values(data);
        // save to states
        setSearchResult(results); 
        setSearchQuery(results);
      }
    });
  }, []);


  // function to search the quiz results
  const searchResult = () => {
    // gets and reads user input in the search bar
    // filter the list with the user inputs
    if(searchInput.length > 0) {
      const resultsFilter = searchResults.filter((result) => 
        // return the results filtered from the list
        result.date.toLowerCase().includes(searchInput.toLowerCase())
      );
      setSearchQuery(resultsFilter);
    } else {
      setSearchQuery(searchResults);
    }
  };

  // extract the current question and its fields from the array safely
  const current = questions[currentQuestion];
  const question = current?.question;
  const answers = current?.answers || [];
  const questionType = current?.questionType;

  //-------------Nevin: Leaderboard-------------------
  const updateLeaderboard = async () => {
    const currentUID = auth.currentUser?.uid;
    if (!currentUID) return;
  
    const userRef = doc(db, 'Leaderboard', currentUID);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) return;
  
    const userData = userSnap.data();
  
    const newCorrectAnswers = (userData.correctAnswers || 0) + result.correctAnswers;
    const newQuizzesCompleted = (userData.quizzesCompleted || 0) + 1;
    const newPoints = (userData.points || 0) + 25 + (result.correctAnswers * 10);
  
    try {
      await updateDoc(userRef, {
        correctAnswers: newCorrectAnswers,
        quizzesCompleted: newQuizzesCompleted,
        points: newPoints,
      });
      console.log("🔥 Leaderboard updated successfully!");
    } catch (error) {
      console.error("🔥 Failed to update leaderboard:", error);
    }
  };

  // Trigger leaderboard update once when results are shown
  useEffect(() => {
    if (showFinalResult) {
      updateLeaderboard();
    }
  }, [showFinalResult]);
  //-------------Nevin: Leaderboard-------------------


  // shows what will be output on the front end of the website
  // holds the container for the quiz to be shown in. It shows the Question, the answers, and the total number of quiz questions with the next button
  // There are placeholders currently set for the question, the answer choices and the answer along with the max number of questions to be received from the database  
  // There is also the Quiz results shown after the quiz is taken to show the resulting score and which questions are correct and incorrect
  return (
    <div className="container">
      {!showFinalResult ? (
        <div className="card">
          <h1 className="title">Language Quiz</h1>
          <div>
            <h2 className="question">{question}</h2>
            {questionType === 'MCQ' ? (
              <ul className='text'>
                {answers.map((item, index) => (
                  <button
                    className={`option ${selectedAnswerIndex === index ? 'selected' : ''}`}
                    key={index}
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
                className="searchBar"
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your answer"
              />
            )}
            <button className="nextButton" onClick={nextButton}>
              Next
            </button>
          </div>
          <div className="index">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      ) : (
        <>
          <div className="results">
            <h2 className="title">Quiz Results</h2>
            <p className="text">Your score: {calcFinalScore()}%</p>
            <p className="text">Correct Answers: {result.correctAnswers}</p>
            <p className="text">Incorrect Answers: {result.incorrectAnswers}</p>
            <ul className="resultstext">
              {answeredQuestions.map((item, index) => (
                <li key={index}>
                  <p style={{ color: item.correct ? '#16de47' : '#ff3333' }}>
                    {item.question}
                  </p>
                  <p>Your answer: {item.userAnswer}</p>
                  {!item.correct && (
                    <p>Correct answer: {item.correctAnswer}</p>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="retryButton"
              onClick={() => {
                compileQuizzes();
                resetQuiz();
              }}
            >
              Retry
            </button>
          </div>
          <div className="search-container">
            <p className="title">Search Quiz Results</p>
            <input
              className="searchBar"
              type="text"
              placeholder="Date of result (ex. 4/4/24)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="nextButton" onClick={searchResult}>
              Next
            </button>
            {searchQuery.length > 0 && (
              <div className="search-results">
                <table className="text">
                  <thead>
                    <tr>
                      <th className="text">Date of Quiz</th>
                      <th className="text">Final Score</th>
                      <th className="text">Correct Answers</th>
                      <th className="text">Incorrect Answers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchQuery.map((result, index) => (
                      <tr key={index}>
                        <td>{result.date}</td>
                        <td>{result.finalScore}</td>
                        <td>{result.correctAnswers}</td>
                        <td>{result.incorrectAnswers}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageQuiz;
