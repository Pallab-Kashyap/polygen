import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
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
  (err) => {
    // Handle 401 Unauthorized errors - redirect to login
    if (err.response?.status === 401) {
      // Check if we're in the admin area
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin")
      ) {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }

    if (err.response?.data?.message) {
      const error = new Error(err.response.data.message);
      (error as any).response = err.response;
      return Promise.reject(error);
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
