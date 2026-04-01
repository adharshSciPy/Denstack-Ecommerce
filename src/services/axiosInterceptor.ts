import axios from "axios";
import baseUrl from "../app/baseUrl";

// Create instance
const axiosInstance = axios.create({
  baseURL: baseUrl.INVENTORY,
  withCredentials: true, // ✅ IMPORTANT for cookies
});

// 🔥 AUTO REFRESH LOGIC
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh API
        await axios.post(
          `${baseUrl.INVENTORY}/api/v1/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        console.log("Refresh failed");
        window.location.href = "/login"; // fallback
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;