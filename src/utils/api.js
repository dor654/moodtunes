import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const response = await axios.post("/auth/refresh", {
            refreshToken,
          });

          const { token: newToken } = response.data;

          // Update stored token
          Cookies.set("token", newToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || "An error occurred";
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    } else {
      // Something else happened
      return Promise.reject(new Error("An unexpected error occurred"));
    }
  }
);

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    // Server error
    return {
      message: error.response.data?.message || "Server error",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Network error
    return {
      message: "Network error - please check your connection",
      status: 0,
      data: null,
    };
  } else {
    // Other error
    return {
      message: error.message || "An unexpected error occurred",
      status: -1,
      data: null,
    };
  }
};

// Helper function for GET requests
export const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function for POST requests
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function for PUT requests
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function for DELETE requests
export const del = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Helper function for PATCH requests
export const patch = async (url, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;
