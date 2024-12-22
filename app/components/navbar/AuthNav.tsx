"use client";
import React from 'react';
import Link from 'next/link';

const AuthNav: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300">
        Login
      </Link>
      <Link href="/signup" className="text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors duration-300">
        Sign Up
      </Link>
    </div>
  );
};

export default AuthNav; 