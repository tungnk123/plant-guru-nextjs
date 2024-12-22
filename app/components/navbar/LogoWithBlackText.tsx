import React from 'react';
import Image from 'next/image';

const LogoWithBlackText: React.FC = () => {
  return (
    <div className="flex items-center group transition-all duration-300 hover:scale-105">
      <div className="relative w-24 h-24 transform transition-transform duration-500 hover:rotate-6">
        <Image
          src="/images/ic_logo.svg"
          alt="Logo"
          width={96}
          height={96}
          className="drop-shadow-lg"
        />
      </div>
      <span className="text-3xl font-bold ml-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent 
        animate-gradient group-hover:scale-105 transition-all duration-300
        drop-shadow-sm">
        Plant Guru
      </span>
    </div>
  );
};

export default LogoWithBlackText; 