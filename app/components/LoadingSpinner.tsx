import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-t-2 border-gray-200 border-t-blue-600 ${className}`} />
  );
};

export default LoadingSpinner; 