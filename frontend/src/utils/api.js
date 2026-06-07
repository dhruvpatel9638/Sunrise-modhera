import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
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
