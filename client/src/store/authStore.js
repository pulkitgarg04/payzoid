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
            
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                set({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
                return true;
            } else {
                throw new Error(response.data.message || "Unexpected response");
            }
        } catch (error) {
            let errorMessage = "Error signing up";
            console.log('Signup error:', error);
            
            if (error.response?.status === 409) {
                errorMessage = error.response?.data?.message || "Email is already in use.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({
                error: errorMessage,
                isLoading: false
            });
            throw new Error(errorMessage);
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
            return true;
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
            });
    
            set({
                user: response.data.user || null,
                isAuthenticated: true,
                isCheckingAuth: false
            });
        } catch (error) {
            console.error("Authentication check failed:", error);
            set({ error: error.response?.data?.message || "Failed to check authentication", isCheckingAuth: false, isAuthenticated: false });
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