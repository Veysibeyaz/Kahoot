// src/pages/LandingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // We'll create this CSS file next
import logo from '../assets/logo.png'; // Make sure you have logo.png in src/assets/
                                      // Or change to '../assets/quiz.png' if that's your image name

const LandingPage = () => {
  const [gamePin, setGamePin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (!gamePin.trim()) {
      setError('Please enter a game PIN');
      return;
    }
    // We'll implement the actual game joining logic later
    // For now, navigate to a placeholder page (you'll need to define this route later)
    // For example: navigate(`/join/${gamePin}`);
    // Or for now, just an alert:
    alert(`Attempting to join game with PIN: ${gamePin}`);
    setError(''); // Clear error on successful attempt
  };

  return (
    <div className="landing-container">
      <header>
        <img src={logo} alt="Quiz Game Logo" className="logo" />
        <h1>QuizMaster</h1>
        <p className="tagline">Create and play quizzes in real-time!</p>
      </header>

      <main>
        <div className="cards-container">
          <div className="card join-card">
            <h2>Join a Game</h2>
            <form onSubmit={handleJoinGame}>
              <input
                type="text"
                placeholder="Enter Game PIN"
                value={gamePin}
                onChange={(e) => setGamePin(e.target.value)}
                className="game-pin-input"
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="join-button">Enter</button>
            </form>
          </div>

          <div className="card host-card">
            <h2>Host a Game</h2>
            <p>Create and manage your own quizzes</p>
            <button
              onClick={() => navigate('/login')}
              className="host-button"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>

      <footer>
        <nav>
          {/* You can make these actual links later if you create these pages */}
          <a href="#about">About</a>
          <a href="#how-to-play">How to Play</a>
          <a href="#contact">Contact</a>
        </nav>
        <p>© {new Date().getFullYear()} QuizMaster</p>
      </footer>
    </div>
  );
};

export default LandingPage;