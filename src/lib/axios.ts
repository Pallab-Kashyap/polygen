import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    const payload = res.data;
    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data;
    }
    return payload;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
