import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const hostelAPI = {
  getAll: (search) => api.get('/hostels', { params: { search } }),
  getById: (id) => api.get(`/hostels/${id}`),
  create: (data) => api.post('/hostels', data),
  update: (id, data) => api.put(`/hostels/${id}`, data),
  delete: (id) => api.delete(`/hostels/${id}`),
};

export const roomAPI = {
  getById: (id) => api.get(`/rooms/${id}`),
  create: (hostelId, data) => api.post(`/rooms/hostel/${hostelId}`, data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getAll: () => api.get('/bookings/all'),
};

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getMe: () => api.get('/auth/me'),
};

export default api;