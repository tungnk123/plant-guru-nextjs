"use client";
import React from "react";
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface UserCardProps {
  userId: string;
  name: string;
  avatar: string;
  showBanButton: boolean;
  isPending?: boolean;
  groupId: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId, name, avatar, showBanButton, isPending, groupId }) => {
  const { toast } = useToast();

  const handleAction = async () => {
    const endpoint = isPending
      ? 'https://un-silent-backend-develop.azurewebsites.net/api/groups/approveJoin'
      : 'https://un-silent-backend-develop.azurewebsites.net/api/groups/kickUser';

    const payload = {
      groupId,
      userId,
    };

    console.log(payload);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: isPending ? "User Approved" : "User Kicked Out",
          description: isPending ? "The user has been approved to join the group." : "The user has been removed from the group.",
          variant: "success",
        });
      } else {
        throw new Error('Failed to perform action');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while performing the action.",
        variant: "destructive",
      });
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