// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const { data } = await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Save new token
        if (data.data?.accessToken) {
          localStorage.setItem('token', data.data.accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// AUTH API ENDPOINTS

export const authAPI = {
  // Register new user
  signup: (formData) => api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Login user
  login: (credentials) => api.post('/auth/login', credentials),

  // Logout user
  logout: () => api.post('/auth/logout'),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),

  // Change password
  changePassword: (data) => api.post('/auth/change-password', data),

  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
};

// ============================================
// PROFILE API ENDPOINTS
// ============================================
export const profileAPI = {
  // Get user profile
  getProfile: () => api.get('/profile/me'),

  // Update profile info (fullName, email)
  updateProfile: (data) => api.patch('/profile/update', data),

  // Change password
  changePassword: (data) => api.patch('/profile/password', data),

  // Update avatar
  updateAvatar: (formData) => api.patch('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// ============================================
// NOTES API ENDPOINTS
// ============================================
export const notesAPI = {
  // Get all notes with filters
  getAll: (params = {}) => api.get('/notes', { params }),

  // Get single note
  getById: (id) => api.get(`/notes/${id}`),

  // Create new note
  create: (noteData) => api.post('/notes', noteData),

  // Update note
  update: (id, noteData) => api.patch(`/notes/${id}`, noteData),

  // Delete note
  delete: (id) => api.delete(`/notes/${id}`),

};

export default api;