// src/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// --- Rotaları import et ---
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/game');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // 3001 -> 3000 DEĞİŞTİRİLDİ
        methods: ["GET", "POST"],
        credentials: true
    }
});

// CORS ayarlarını da güncelle
app.use(cors({
    origin: "http://localhost:3000", // 3000 portunu ekle
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Socket.IO'yu app'e ekle
app.set('io', io);

// Socket.IO bağlantı yönetimi
io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı:', socket.id);

    // Oyun odasına katılma
    socket.on('joinGameRoom', (gameCode) => {
        socket.join(`game:${gameCode}`);
        console.log(`Socket ${socket.id} ${gameCode} kodlu oyun odasına katıldı`);
    });

    // Oyun odasından ayrılma
    socket.on('leaveGameRoom', (gameCode) => {
        socket.leave(`game:${gameCode}`);
        console.log(`Socket ${socket.id} ${gameCode} kodlu oyun odasından ayrıldı`);
    });

    // Bağlantı koptuğunda
    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı:', socket.id);
    });
});

// --- Rotaları kullan ---
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);

// Ana sayfa için basit bir rota
app.get('/', (req, res) => {
    res.send('Kahoot Clone API Çalışıyor!');
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB bağlantısı başarılı');
        server.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
    }).catch(err => {
        console.error('MongoDB bağlantı hatası:', err);
    });

// src/index.js dosyanızın EN SONUNA (mevcut kodları değiştirmeyin, sadece ekleyin):

// MongoDB bağlantısı
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('MongoDB bağlantısı başarılı');
        })
        .catch(err => {
            console.error('MongoDB bağlantı hatası:', err);
        });
} else {
    console.warn('MONGODB_URI environment variable is not set');
}

// Vercel için export
module.exports = app;

// Sadece local development için server başlat
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server ${PORT} portunda çalışıyor`);
    });
}