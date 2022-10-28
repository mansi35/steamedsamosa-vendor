import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:1337' });
API.interceptors.request.use((req) => {
  if (JSON.parse(localStorage.getItem('profile'))?.jwt) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).jwt}`;
  }
  return req;
});

// User Auth API
export const signIn = (profile) => API.post('/auth/local', profile);
export const signUp = (profile) => API.post('/auth/local/register', profile);
export const sendEmailVerification = (emailId) => API.post('/auth/send-email-confirmation', { email: emailId, url: 'https://raahee-server.eastus.cloudapp.azure.com/admin/plugins/users-permissions/auth/send-email-confirmation' });
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email, url: 'https://raahee-server.eastus.cloudapp.azure.com/admin/plugins/users-permissions/auth/reset-password' });
export const resetPassword = (password, confirmPassword, code) => API.post('/auth/reset-password', { password, passwordConfirmation: confirmPassword, code });
export const updateProfile = (data) => API.put('/services/edit-user', data);
