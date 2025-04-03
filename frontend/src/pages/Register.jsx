import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { registerValidation } from '../utils/validation';
import ThemeToggle from '../components/ui/ThemeToggle';

const Register = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(initialState, registerValidation);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { confirmPassword, ...userData } = values;
      await register(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md">
        {/* Card header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Web Chat Online 2</h1>
          <p className="text-base-content/70">Tạo tài khoản mới</p>
        </div>
        
        {/* Register Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center mb-6">Đăng ký</h2>
            
            {error && (
              <div className="alert alert-error mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tên người dùng</span>
                </label>
                <input 
                  type="text" 
                  name="username" 
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tên hiển thị của bạn" 
                  className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`} 
                  required 
                />
                {errors.username && <span className="text-error text-sm mt-1">{errors.username}</span>}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your-email@example.com" 
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} 
                  required 
                />
                {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mật khẩu</span>
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ít nhất 6 ký tự" 
                  className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`} 
                  required 
                />
                {errors.password && <span className="text-error text-sm mt-1">{errors.password}</span>}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Xác nhận mật khẩu</span>
                </label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Nhập lại mật khẩu" 
                  className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`} 
                  required 
                />
                {errors.confirmPassword && <span className="text-error text-sm mt-1">{errors.confirmPassword}</span>}
              </div>
              
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Tôi đồng ý với <a href="#" className="link link-primary">Điều khoản sử dụng</a></span> 
                  <input type="checkbox" className="checkbox checkbox-primary" required />
                </label>
              </div>
              
              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
              </div>
            </form>
            
            <div className="divider my-6">hoặc</div>
            
            <div className="text-center">
              <p className="text-base-content/70">
                Đã có tài khoản?{' '}
                <Link to="/login" className="link link-primary">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-base-content/60">
            &copy; 2025 Web Chat Online - Kết nối mọi khoảng cách
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;