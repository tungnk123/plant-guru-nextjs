"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserComponentProps {
  avatar: string;
  name: string;
  userId: string;
}

const UserComponent: React.FC<UserComponentProps> = ({ avatar, name, userId }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const myId = localStorage.getItem('userId');  
  const router = useRouter();

  const handleUserClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleChatClick = async () => {
    console.log(`Start chat with user ${userId}`);
    const messageData = {
        userSendId: localStorage.getItem('userId'),
        userReceiveId: userId,
        message: "Hello",
      };
  
      try {
        const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/chat/sendText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        router.push('/chat');
      } catch (error) {
        console.error('Error sending message:', error);
      }
  };

  return (
    <div className="relative">
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
      {isMenuOpen && userId !== myId && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
          <button
            onClick={handleChatClick}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
          >
            Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default UserComponent; 