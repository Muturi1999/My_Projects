import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/profile/');
      setUser(res.data);
    } catch (err) {
      console.error('User fetch failed', err);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login/', { email, password });
      const token = res.data.access;
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      await fetchUser();
      router.push('/');
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
