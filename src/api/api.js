// src/api/api.js

import axios from 'axios';

// Create an Axios instance with a base URL
// Replace 'http://localhost:5000' with your backend's URL when you deploy
const API = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000, // Optional: set a timeout for requests
});

// --- Auth Endpoints ---

// Handles user login, sending credentials and returning a JWT token
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/api/auth/login', { email, password });
    return response.data; // This will likely contain the JWT token
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error;
  }
};

// Handles user registration
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response.data);
    throw error;
  }
};

// --- Drive Upload Endpoints ---

// Sends a file to the backend for upload to Google Drive
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await API.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // You might need to add an authorization header here if your upload route is protected
      // headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('File upload error:', error.response.data);
    throw error;
  }
};

// --- User Profile Endpoints ---

// Fetches user profile data from the backend
// This route should be protected and require a JWT token
export const getUserProfile = async (token) => {
  try {
    const response = await API.get('/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`, // Include the JWT token for authentication
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error.response.data);
    throw error;
  }
};