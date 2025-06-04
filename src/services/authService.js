// src/services/authService.js
import axios from 'axios';

// Backend API'nizin temel URL'si.
const API_BASE_URL = 'http://localhost:5000/api/auth'; // Kendi backend URL'inize göre ayarlayın

/**
 * Kullanıcı giriş isteği gönderir.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} API cevabı (örneğin, { token: "...", user: {...} } veya hata objesi)
 */
const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);

    // Başarılı girişte backend'den token dönüyorsa localStorage'a kaydet
    if (response.data && response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      console.log('Login successful, token stored:', response.data.token);
      // İsteğe bağlı: Eğer backend kullanıcı bilgilerini de token ile birlikte dönüyorsa (response.data.user gibi),
      // onu da saklayabilirsiniz. Örneğin:
      // if (response.data.user) {
      //   localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      // }
    }
    return response.data; // Backend'den dönen tüm veriyi (token dahil) döndür
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    // Hata durumunda, backend'den gelen hata objesini (örn: { message: "Geçersiz kimlik bilgileri" })
    // veya genel bir hata objesini fırlat.
    throw error.response?.data || { message: 'Login failed due to an unexpected server error.' };
  }
};

/**
 * Yeni kullanıcı kayıt isteği gönderir.
 * @param {object} userData - { username, email, password }
 * @returns {Promise<object>} API cevabı (örneğin, { message: "User registered successfully" } veya hata objesi)
 */
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    console.log('Registration successful:', response.data);
    // Genellikle kayıt sonrası bir mesaj döner, token dönmeyebilir.
    // Eğer kayıt sonrası otomatik login yapılıp token dönüyorsa, login fonksiyonundaki gibi token saklama eklenebilir.
    return response.data; // Backend'den dönen tüm veriyi döndür
  } catch (error) {
    console.error('Register API error:', error.response?.data || error.message);
    // Hata durumunda, backend'den gelen hata objesini veya genel bir hata objesini fırlat.
    // Örneğin, email zaten kullanılıyorsa backend { message: "Email already in use" } dönebilir.
    throw error.response?.data || { message: 'Registration failed due to an unexpected server error.' };
  }
};

/**
 * Kullanıcı çıkış işlemi (localStorage'dan token'ı siler).
 */
const logout = () => {
  localStorage.removeItem('userToken');
  // if (localStorage.getItem('userInfo')) { // Eğer kullanıcı bilgilerini de sakladıysanız
  //   localStorage.removeItem('userInfo');
  // }
  console.log('User logged out, token removed.');
  // Uygulamanızın yapısına göre kullanıcıyı login sayfasına yönlendirebilirsiniz.
  // Örneğin, React Router kullanıyorsanız: navigate('/login');
  // Veya doğrudan: window.location.href = '/login'; (sayfa yenilenir)
};

/**
 * Mevcut giriş yapmış kullanıcının token'ını localStorage'dan döndürür.
 * @returns {string|null} Kullanıcı token'ı veya null (eğer token yoksa)
 */
const getCurrentUserToken = () => {
  return localStorage.getItem('userToken');
};

/**
 * Mevcut giriş yapmış kullanıcının bilgilerini localStorage'dan döndürür (eğer saklandıysa).
 * @returns {object|null} Kullanıcı bilgileri objesi veya null
 */
// const getCurrentUserInfo = () => {
//   const userInfoString = localStorage.getItem('userInfo');
//   try {
//     return userInfoString ? JSON.parse(userInfoString) : null;
//   } catch (error) {
//     console.error("Error parsing user info from localStorage", error);
//     return null;
//   }
// };

// Servis fonksiyonlarını bir obje içinde dışa aktar
const authService = {
  login,
  register,
  logout,
  getCurrentUserToken,
  // getCurrentUserInfo, // Eğer kullanacaksanız bu satırın yorumunu kaldırın
};

export default authService;