import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ApiClient from "../ApiClient";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const login = async (response) => {
    Cookies.set('access', response.data.access);
    Cookies.set('refresh', response.data.refresh);
    setIsAuthenticated(true);
    ApiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    navigate('/');
  };

  const register = async (username, email, password) => {
    try {
      const response = await ApiClient.post('/api/register/', { username, email, password });
      login(response);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    Cookies.remove('access');
    Cookies.remove('refresh');
    setIsAuthenticated(false);
    delete ApiClient.defaults.headers.common['Authorization'];
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = Cookies.get('access');
      const refreshToken = Cookies.get('refresh');
      if (accessToken && refreshToken && isMounted.current) {
        try {
          await ApiClient.post('/api/token/verify/', {token: accessToken});
          setIsAuthenticated(true);
          ApiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error("Ошибка проверки токена:", error);
          logout();
        }
      }
    };

    verifyToken();

    return () => {
      isMounted.current = false;
    };
  }, [navigate, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
