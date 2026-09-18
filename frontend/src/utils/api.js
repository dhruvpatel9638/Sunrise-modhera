import axios from 'axios';

const API_BASE_URL = 'https://sunrise-modhera-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if admin is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sunrise_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  verify: () => api.get('/admin/verify'),
  logout: () => {
    localStorage.removeItem('sunrise_admin_token');
  }
};

export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (roomData) => api.post('/rooms', roomData),
  update: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  delete: (id) => api.delete(`/rooms/${id}`),
  restoreDefaults: () => api.post('/rooms/restore-defaults'),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const inquiryAPI = {
  create: (inquiryData) => api.post('/inquiries', inquiryData),
  getAll: () => api.get('/inquiries'),
  delete: (id) => api.delete(`/inquiries/${id}`),
};

export const reviewAPI = {
  getAll: () => api.get('/reviews'),
  getAllAdmin: () => api.get('/reviews/all'),
  create: (reviewData) => api.post('/reviews', reviewData),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
