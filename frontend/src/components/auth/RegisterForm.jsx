import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../../hooks/useForm';
import { registerValidation } from '../../utils/validation';
import InputField from './InputField';
import PasswordField from './PasswordField';
import SubmitButton from './SubmitButton';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
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
      setApiError('');
      
      const { confirmPassword, ...userData } = values;
      await register(userData);
      // Chuyển hướng sẽ được xử lý bởi AuthContext
    } catch (error) {
      setApiError(
        error.response?.data?.message || 
        'Đăng ký thất bại. Vui lòng thử lại.'
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
        label="Tên người dùng"
        id="username"
        placeholder="Nhập tên người dùng"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.username}
        required
      />
      
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
        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        required
      />
      
      <PasswordField
        label="Xác nhận mật khẩu"
        id="confirmPassword"
        placeholder="Nhập lại mật khẩu"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.confirmPassword}
        required
      />
      
      <div className="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          Tôi đồng ý với <a href="#" className="text-indigo-600 hover:text-indigo-500">Điều khoản sử dụng</a>
        </label>
      </div>
      
      <SubmitButton
        text="Đăng ký"
        loading={loading}
      />
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Đăng nhập
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;