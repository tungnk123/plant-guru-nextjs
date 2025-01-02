"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserComponentProps {
  avatar: string;
  name: string;
  userId: string;
}

const UserComponent: React.FC<UserComponentProps> = ({ avatar, name, userId }) => {
  const router = useRouter();

  const handleUserClick = () => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={handleUserClick}>
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