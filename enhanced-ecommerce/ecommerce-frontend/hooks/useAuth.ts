/* eslint-disable @typescript-eslint/no-explicit-any */
// ecommerce-frontend/src/hooks/useAuth.ts (Conceptual file)
// NOTE: This is complex state management, shown conceptually here.

import api from '@/lib/api';
import { useState, useEffect, useContext, createContext } from 'react';
// import api from 'lib/api';

interface AuthContextType {
  user: any; // User details
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ... Context and Provider setup

export const useAuth = () => {
    // 1. Login Function: Calls /api/auth/login, stores access/refresh tokens in localStorage/cookies.
    const login = async (username: string, password: string) => {
        const response = await api.post('/auth/login/', { username, password });
        const { access, refresh } = response.data;
        // Store tokens securely (e.g., HttpOnly cookies, or localStorage for simple example)
        localStorage.setItem('access_token', access); 
        localStorage.setItem('refresh_token', refresh);
        await fetchUserProfile();
    };

    // 2. Register Function: Calls /api/auth/register
    const register = async (data: any) => {
        await api.post('/auth/register/', data);
        // Automatically log in the user after registration
        await login(data.username, data.password);
    };

    // 3. Profile Fetch: Used for Account Dashboard (My Profile)
    const fetchUserProfile = async () => {
        // ... set Authorization header with Access Token
        const response = await api.get('/account/profile/');
        // setUser(response.data);
    };

    // 4. Logout: Clears tokens and user state.
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // setUser(null);
    };

    return { login, register, logout, isAuthenticated: true /* conceptual */ };
};