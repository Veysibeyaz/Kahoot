// src/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User modelini import et

const router = express.Router();

// --- Kullanıcı Kayıt Rotası ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basit doğrulama
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' });
    }

    try {
        // Kullanıcı veya e-posta zaten var mı kontrol et
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor' });
        }

        // Yeni kullanıcı oluştur (şifre modeldeki pre-save hook ile hash'lenecek)
        user = new User({
            username,
            email,
            password
        });

        // Kullanıcıyı veritabanına kaydet
        await user.save();

        // Başarılı kayıt yanıtı (isterseniz token da dönebilirsiniz)
        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi' });

    } catch (error) {
        console.error('Kayıt hatası:', error.message);
        // Mongoose doğrulama hatası kontrolü
        if (error.name === 'ValidationError') {
            // Hataları daha kullanıcı dostu bir formatta topla
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Doğrulama hatası', errors });
        }
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// --- Kullanıcı Giriş Rotası ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basit doğrulama
    if (!email || !password) {
        return res.status(400).json({ message: 'Lütfen e-posta ve şifrenizi girin' });
    }

    try {
        // Kullanıcıyı e-posta ile bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Geçersiz kimlik bilgileri' }); // Kullanıcının var olup olmadığını belli etme
        }

        // Şifreleri karşılaştır (User modelindeki metodu kullan)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });
        }

        // Şifre doğruysa JWT oluştur
        const payload = {
            user: {
                id: user.id // Token içine kullanıcı ID'sini ekle
                // İsterseniz başka bilgiler de ekleyebilirsiniz (örn: username, role)
            }
        };

        // Token imzala (.env dosyasında bir JWT_SECRET tanımlamak en iyisidir)
        // Şimdilik geçici bir secret kullanalım
        const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar123'; // .env'ye eklemeyi unutmayın!
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Token geçerlilik süresi

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }, // Token 1 saat geçerli olacak
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Token'ı kullanıcıya gönder
            }
        );

    } catch (error) {
        console.error('Giriş hatası:', error.message);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});


module.exports = router; // Router'ı export et