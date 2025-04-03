import React from 'react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ui/ThemeToggle';

const ChatPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col transition-colors duration-200">
      <header className="bg-base-100 shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Web Chat Online</h1>
          <div className="flex items-center gap-4">
            <span className="text-base-content">
              Xin chào, {user?.username}
            </span>
            <ThemeToggle />
            <button
              onClick={logout}
              className="btn btn-error btn-sm"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto bg-base-100 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-base-content">Chào mừng đến với Web Chat Online</h2>
          <p className="text-base-content/70">
            Tính năng chat đang được phát triển. Vui lòng quay lại sau.
          </p>
        </div>
      </main>

      <footer className="bg-base-100 py-4 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base-content/60 text-sm">
            &copy; 2025 Web Chat Online - Kết nối mọi khoảng cách
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;