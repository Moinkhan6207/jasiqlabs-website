import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

// Constants
const TOKEN_KEY = 'adminToken'; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX 1: 'checkAuth' se location ki dependency hata di gayi hai.
  // Ab ye sirf Token verify karega, Redirect nahi karega.
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.getCurrentUser();
      const userData = response.data?.data?.user || response.data?.user || response.data;
      
      // Sirf user set karein
      setUser(userData);
    } catch (error) {
      console.error('Auth Check Failed:', error);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // Dependency Array Empty rahega (No Loop)

  // Initial Auth Check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ FIX 2: Redirect Logic ko alag useEffect mein daal diya.
  // Ye tabhi chalega jab 'user' state update hoga.
  useEffect(() => {
    if (user && location.pathname === '/admin/login') {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // Login Function
  const login = async (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      await checkAuth(); // Token save hone ke baad user fetch karein
      return { success: true };
    } catch (error) {
      console.error('Login Context Failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    navigate('/admin/login', { replace: true });
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;