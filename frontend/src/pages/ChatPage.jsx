import React from 'react';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Web Chat Online</h1>
          <button 
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trang Chat</h2>
          <p className="text-gray-600">
            Tính năng chat đang được phát triển. Vui lòng quay lại sau.
          </p>
        </div>
      </main>
      <footer className="bg-white p-4 shadow-inner">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          &copy; 2025 Web Chat Online
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;