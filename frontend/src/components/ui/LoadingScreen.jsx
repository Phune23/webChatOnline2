import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-base-200 transition-colors duration-200">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-lg text-base-content">Đang tải...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;