// src/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- Rotaları import et ---
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz'); // Yeni quiz rotalarını import et
// -------------------------

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Rotaları kullan ---
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes); // /api/quizzes ile başlayan istekleri quizRoutes'a yönlendir
// --------------------

// Ana sayfa için basit bir rota
app.get('/', (req, res) => {
    res.send('Kahoot Clone API Çalışıyor!');
});

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB bağlantısı başarılı');
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
}).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
});