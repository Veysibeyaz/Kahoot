// src/pages/GamePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './GamePage.css';

const GamePage = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  
  // Auth states
  const [token, setToken] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Game states
  const [gameData, setGameData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState('question');

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const userToken = authService.getCurrentUserToken();
      const userData = authService.getCurrentUser();
      
      if (!userToken || !userData) {
        navigate('/login');
        return;
      }
      
      setToken(userToken);
      setAuthChecked(true);
    };

    checkAuth();
  }, [navigate]);

  // Submit answer function
  const submitAnswer = useCallback(async () => {
    if (!token || !currentQuestion) return;

    try {
      const response = await fetch(`http://localhost:5000/api/games/${gameCode}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: currentQuestion._id,
          selectedAnswer: selectedAnswer,
          timeSpent: 15 - timeLeft
        })
      });

      if (response.ok) {
        const result = await response.json();
        setScore(result.score || score);
        setGameState('waiting');
      }
    } catch (err) {
      console.error('Answer submit error:', err);
    }
  }, [token, currentQuestion, gameCode, selectedAnswer, timeLeft, score]);

  // Fetch game data
  const fetchGameData = useCallback(async () => {
    if (!authChecked || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/games/${gameCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          navigate('/login');
          return;
        }
        throw new Error('Oyun verilerini çekerken hata oluştu');
      }

      const data = await response.json();
      setGameData(data);
      
      // İlk soruyu ayarla
      if (data.quiz && data.quiz.questions && data.quiz.questions.length > 0) {
        setCurrentQuestion(data.quiz.questions[0]);
        setQuestionIndex(0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Game data fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [gameCode, token, authChecked, navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && gameState === 'question') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'question') {
      submitAnswer();
    }
  }, [timeLeft, gameState, submitAnswer]);

  // Initial data fetch
  useEffect(() => {
    if (authChecked) {
      fetchGameData();
    }
  }, [authChecked, fetchGameData]);

  const handleAnswerSelect = (optionIndex) => {
    if (timeLeft > 0 && gameState === 'question') {
      setSelectedAnswer(optionIndex);
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 10) return 'timer-green';
    if (timeLeft > 5) return 'timer-yellow';
    return 'timer-red';
  };

  const getOptionColor = (index) => {
    const colors = ['option-red', 'option-blue', 'option-yellow', 'option-green'];
    return colors[index] || 'option-gray';
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  if (!authChecked) {
    return (
      <div className="game-container loading-screen">
        <div className="loading-text">Kimlik doğrulanıyor...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="game-container loading-screen">
        <div className="loading-text">Oyun yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container error-screen">
        <div className="error-content">
          <h2>Hata</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="back-button"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="game-container loading-screen">
        <div className="loading-text">Sorular yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="header-left">
          <div className="game-title">QuizMaster</div>
          <div className="question-counter">
            Soru {questionIndex + 1}/{gameData?.quiz?.questions?.length || 1}
          </div>
        </div>
        
        <div className="header-right">
          <div className="score-display">
            <div className="score-label">Skorun</div>
            <div className="score-value">{score.toLocaleString()}</div>
          </div>
          
          <div className="timer-container">
            <div className={`timer-circle ${getTimerColor()}`}>
              {timeLeft}
            </div>
          </div>
        </div>
      </header>

      <div className="game-content">
        <div className="question-container">
          <div className="question-box">
            <h1 className="question-text">
              {currentQuestion.questionText}
            </h1>
          </div>
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={timeLeft === 0 || gameState !== 'question'}
              className={`
                option-button ${getOptionColor(index)}
                ${selectedAnswer === index ? 'selected' : ''}
                ${timeLeft === 0 || gameState !== 'question' ? 'disabled' : ''}
              `}
            >
              <div className="option-content">
                <div className="option-letter">
                  {getOptionLetter(index)}
                </div>
                <span className="option-text">{option}</span>
              </div>
              
              {selectedAnswer === index && (
                <div className="check-mark">✓</div>
              )}
            </button>
          ))}
        </div>

        <div className="bottom-info">
          {gameState === 'question' && timeLeft > 0 ? (
            <p className="info-text">
              {selectedAnswer !== null ? 'Cevabın kaydedildi! Diğer oyuncular bekleniyor...' : 'Bir seçenek seç!'}
            </p>
          ) : gameState === 'question' && timeLeft === 0 ? (
            <p className="info-text bold">
              Süre doldu! Sonuçlar gösteriliyor...
            </p>
          ) : (
            <p className="info-text">
              Diğer oyuncular cevaplarını veriyor...
            </p>
          )}
        </div>
      </div>

      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ width: `${(timeLeft / 15) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default GamePage;