"use client";
import React from "react";
import Image from 'next/image';

interface UserCardProps {
  userId: string;
  name: string;
  avatar: string;
  showBanButton: boolean;
  isPending?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ userId, name, avatar, showBanButton, isPending }) => {
  const handleAction = () => {
    if (isPending) {
      // Logic to approve the user
      console.log(`Approving user: ${userId}`);
    } else {
      // Logic to ban the user
      console.log(`Banning user: ${userId}`);
    }
  };

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="h-12 w-12 rounded-full mr-4"
        />
        <span className="font-semibold text-gray-800">{name}</span>
      </div>
      {showBanButton && (
        <button
          onClick={handleAction}
          className={`px-3 py-1 text-white rounded ${isPending ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {isPending ? 'Approve' : 'Kick out'}
        </button>
      )}
    </div>
  );
};

export default UserCard; 