import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { loginValidation } from '../../utils/validation';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SubmitButton from './SubmitButton';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const initialState = {
    email: '',
    password: ''
  };
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(initialState, loginValidation);
  
  const onSubmit = async () => {
    try {
      setLoading(true);
      setApiError('');
      await login(values.email, values.password);
      // Chuyển hướng sẽ được xử lý bởi AuthContext
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}
      
      <InputField
        label="Email"
        id="email"
        type="email"
        placeholder="Nhập email của bạn"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        required
      />
      
      <PasswordField
        label="Mật khẩu"
        id="password"
        placeholder="Nhập mật khẩu của bạn"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        required
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Ghi nhớ đăng nhập
          </label>
        </div>
        
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Quên mật khẩu?
          </a>
        </div>
      </div>
      
      <SubmitButton
        text="Đăng nhập"
        loading={loading}
      />
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;