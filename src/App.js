// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyQuiz from './pages/MyQuiz';
import CreateQuizPage from './pages/CreateQuizPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-quizzes" element={<MyQuiz />} />
        <Route path="/create-quiz" element={<CreateQuizPage/>} />
        <Route path="/join-game" element={<div>Join Game Page (Coming Soon)</div>} />
        <Route path="/join-game/:pin" element={<div>Join Game with PIN (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;