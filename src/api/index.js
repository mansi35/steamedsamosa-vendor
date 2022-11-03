import axios from 'axios';

// const API = axios.create({ baseURL: 'https://raahee-server.eastus.cloudapp.azure.com' });
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
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email: email, url: 'https://raahee-server.eastus.cloudapp.azure.com/admin/plugins/users-permissions/auth/reset-password' });
export const resetPassword = (password, confirmPassword, code) => API.post('/auth/reset-password', { password: password, passwordConfirmation: confirmPassword, code: code });
export const updateProfile = (data) => API.put('/services/edit-user', data);
export const googleSignIn = (search) => API.get(`/auth/google/callback?${search}`);

// MHP Schedule API
export const fetchSchedule = (mhpId) => API.get(`/appointment-schedules?mhp=${mhpId}&_sort=startTime:DESC`);
export const createSchedule = (schedule) => API.post('/appointment-schedules/manage', schedule);
export const deleteSchedule = (scheduleId) => API.delete(`/appointment-schedules/manage/${scheduleId}`);
export const updateSchedule = (scheduleId, updatedSchedule) => API.put(`/appointment-schedules/manage/${scheduleId}`, updatedSchedule);

// MHP Work Experience API
export const fetchWorkExp = (mhpId) => API.get(`/therapist-workExp?mhp=${mhpId}&_sort=startDateTime:DESC`);
export const createWorkExp = (workExp) => API.post('/therapist-workExp', workExp);
export const deleteWorkExp = (expId) => API.delete(`/therapist-workExp/${expId}`);
export const updateWorkExp = (expId, updatedWorkExp) => API.put(`/therapist-workExp/${expId}`, updatedWorkExp);

// Upload File
export const uploadFile = (file) => API.post('/upload', file);

// Email API
export const sendEmail = (email) => API.post('/emails', email);
