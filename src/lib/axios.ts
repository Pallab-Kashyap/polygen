import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  withCredentials: true,
});

api.interceptors.response.use((res) => res.data, (err) => Promise.reject(err));

export default api;
