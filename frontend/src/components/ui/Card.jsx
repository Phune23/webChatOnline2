import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-md bg-white rounded-lg shadow-md p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;