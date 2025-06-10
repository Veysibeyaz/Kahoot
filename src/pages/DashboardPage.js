// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './DashboardPage.css';
import logo from '../assets/logo.png'; // Logo dosyanızın yolunu doğru şekilde belirtin

const DashboardPage = () => {
  const [username, setUsername] = useState('User');
  const [loading, setLoading] = useState(true);
  const [gamePin, setGamePin] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcının giriş yapmış olup olmadığını kontrol et
    const token = authService.getCurrentUserToken();
    if (!token) {
      navigate('/login');
      return;
    }

    // Burada backend'den kullanıcı bilgilerini çekebilirsiniz
    setTimeout(() => {
      setUsername('John Doe'); // Gerçek uygulamada bu, API'den alınacak
      setLoading(false);
    }, 800); // Simüle edilmiş yükleme süresi
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleCreateQuiz = () => {
    // Quiz oluşturma sayfasına yönlendir
    navigate('/create-quiz');
  };

  const handleMyQuizzes = () => {
    // Quizlerim sayfasına yönlendir
    navigate('/my-quizzes');
  };

 const handleJoinGame = () => {
  if (gamePin.trim()) {
    console.log('Joining game with code:', gamePin.trim()); // Debug için
    navigate(`/join-game/${gamePin.trim()}`);
  } else {
    alert('Lütfen bir oyun kodu girin!');
  }
};

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <img src={logo} alt="QuizMaster Logo" className="header-logo" />
          <h1>QuizMaster</h1>
        </div>
        <div className="dashboard-user">
          <div className="user-info">
            <span className="user-greeting">Welcome,</span>
            <span className="user-name">{username}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Quick Access Cards */}
        <section className="quick-access-section">
          <div className="quick-access-cards">
            <div className="quick-card create-quiz-card" onClick={handleCreateQuiz}>
              <div className="card-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <h3>Create New Quiz</h3>
              <p>Design your own interactive quiz with multiple choice questions</p>
              <button className="card-button create-button">Create Quiz</button>
            </div>
            
            <div className="quick-card join-game-card">
              <div className="card-icon">
                <i className="fas fa-gamepad"></i>
              </div>
              <h3>Join a Game</h3>
              <p>Enter a game PIN to join as a player</p>
              <div className="join-game-input-group">
                <input 
                  type="text" 
                  placeholder="Enter game PIN" 
                  value={gamePin}
                  onChange={(e) => setGamePin(e.target.value)}
                  className="game-pin-input"
                />
                <button onClick={handleJoinGame} className="join-game-button">Join</button>
              </div>
            </div>
            
            <div className="quick-card my-quizzes-card" onClick={handleMyQuizzes}>
              <div className="card-icon">
                <i className="fas fa-list-check"></i>
              </div>
              <h3>My Quizzes</h3>
              <p>View, edit and manage all your created quizzes</p>
              <button className="card-button my-quizzes-button">View Quizzes</button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2023 QuizMaster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;