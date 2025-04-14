// src/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- Rotaları import et ---
const authRoutes = require('./routes/auth');
// -------------------------

const app = express();
app.use(cors());
app.use(express.json());

// Kontrol loglarını kaldırabiliriz veya yorum satırı yapabiliriz
// console.log('MONGODB_URI .env içinden:', process.env.MONGODB_URI);
// console.log('PORT .env içinden:', process.env.PORT);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Rotaları kullan ---
// /api/auth ile başlayan tüm istekleri authRoutes'a yönlendir
app.use('/api/auth', authRoutes);
// --------------------

// Ana sayfa için basit bir rota (isteğe bağlı)
app.get('/', (req, res) => {
    res.send('Kahoot Clone API Çalışıyor!');
});

mongoose.connect(MONGODB_URI) // useNewUrlParser ve useUnifiedTopology kaldırıldı
.then(() => {
    console.log('MongoDB bağlantısı başarılı');
    app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
}).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
});