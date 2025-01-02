"use client";
import React from 'react';
import Image from 'next/image';

interface UserComponentProps {
  avatar: string;
  name: string;
  userId: string;
}

function handleUserClick(userId: string){
    console.log(userId);
}

const UserComponent: React.FC<UserComponentProps> = ({ avatar, name, userId }) => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleUserClick(userId)}>
      <Image
        src={avatar}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full"
      />
      <span className="font-semibold text-gray-800">{name}</span>
    </div>
  );
};

export default UserComponent; 