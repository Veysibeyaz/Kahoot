import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Link'i Navbar içinde kullanacağımız için buradan kaldırabiliriz, ama kalmasında da bir sakınca yok.
import HomePage from './pages/HomePage';
import CreateQuizPage from './pages/CreateQuizPage';
import QuizHostPage from './pages/QuizHostPage';
import QuizPlayerPage from './pages/QuizPlayerPage';
import ScoreBoardPage from './pages/ScoreBoardPage';
import Navbar from './components/layout/Navbar'; // Navbar importu aktif
import './App.css'; // Varsayılan App.css veya kendi global stil dosyanız

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar bileşenini burada çağırıyoruz */}
      <div className="container" style={{ padding: '20px' }}> {/* Sayfa içeriği için basit bir container */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          {/* 
            Quiz Host, Player ve Scoreboard sayfaları için dinamik route'lar.
            :quizId ve :quizPin gibi parametreler, ilgili bileşen içinden useParams() hook'u ile alınabilir.
            Örneğin, QuizHostPage içinde const { quizId } = useParams(); şeklinde.
          */}
          <Route path="/quiz/:quizId/host" element={<QuizHostPage />} />
          <Route path="/quiz/:quizPin/play" element={<QuizPlayerPage />} />
          <Route path="/quiz/:quizId/scoreboard" element={<ScoreBoardPage />} />
          
          {/* Gelecekte eklenebilecek diğer route'lar için bir yer: */}
          {/* <Route path="/login" element={<LoginPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> // Eşleşmeyen yollar için 404 sayfası */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;