import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/ui/Card';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Web Chat Online</h1>
        <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
};

export default Login;