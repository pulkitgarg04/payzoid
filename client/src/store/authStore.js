import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

axios.defaults.withCredentials = true;

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred.";
  }
  return error.message || "An unexpected error occurred.";
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        firstName,
        lastName,
      });

      localStorage.setItem("token", response.data.token);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });

      return true;
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false, error: null });
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      set({
        user: response.data.user || null,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      const errorMessage = handleError(error);
      set({
        error: errorMessage,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  forgetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forget-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/update`, userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      set({ user: response.data.user, isLoading: false });
      return true;
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  changeAvatar: async (file) => {
    set({ isLoading: true, error: null });

    try {
      const base64 = await convertToBase64(file);

      const response = await axios.post(av
        `${API_URL}/upload`,
        {
          image: base64,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const avatarUrl = response.data.data.url;
        set({ user: { ...response.data.user, avatar: avatarUrl }, isLoading: false });
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
