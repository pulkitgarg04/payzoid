import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user`;

axios.defaults.withCredentials = true;

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
            const response = await axios.post(`${API_URL}/signup`, { email, password, firstName, lastName });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false
            });
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            set({
                error: error.response.data.message || "Error signing up",
                isLoading: false
            });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({
                user: response.data.user,
                isAuthenticated: true,
                error: null,
                isLoading: false
            });
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error('Login error:', error);
            set({
                error: error.response?.data?.message || "Error logging in",
                isLoading: false
            });
            throw error;
        }
    },
    
    logout: async () => {
        try {
            localStorage.clear();
            set({
                user: null,
                isAuthenticated: false,
                error: null,
            });
        } catch (error) {
            set({ error: "Error logging out" });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false
            });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get(`${API_URL}/check-auth`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
            );
            set({
                user: response.data.user,
                isAuthenticated: true,
                isCheckingAuth: false
            });
        } catch {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    forgetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forget-password`, { email });
            set({
                message: response.data.message,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response.data.message || "Error sending email",
                isLoading: false
            });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({
                message: response.data.message,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error.response.data.message || "Error resetting password",
                isLoading: false
            });
            throw error;
        }
    },
}));