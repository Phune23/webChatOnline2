import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        }
      } catch (error) {
        // Nếu token không hợp lệ, xóa khỏi localStorage
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Hàm đăng ký
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      
      // Thiết lập token cho các request tiếp theo
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Cập nhật state
      setUser(user);
      
      // Chuyển hướng đến trang chính
      navigate('/');
      
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng nhập
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('token', token);
      
      // Thiết lập token cho các request tiếp theo
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Cập nhật state
      setUser(user);
      
      // Chuyển hướng đến trang chính
      navigate('/');
      
      return user;
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      
      // Xóa token khỏi header mặc định
      delete api.defaults.headers.common['Authorization'];
      
      // Cập nhật state
      setUser(null);
      
      // Chuyển hướng về trang đăng nhập
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật thông tin người dùng
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await api.put('/users/profile', userData);
      setUser(response.data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    initializing,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};