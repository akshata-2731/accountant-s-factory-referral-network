
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden p-6 hover:shadow-2xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
