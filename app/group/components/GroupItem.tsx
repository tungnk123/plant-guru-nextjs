"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface GroupItemProps {
  id: string;
  groupName: string;
  description: string;
  groupImage: string;
  numberOfMembers: number;
  numberOfPosts: number;
  status: string;
  userId: string;
  masterUserId: string;
}

export default function GroupItem({
  id,
  groupName,
  description,
  groupImage,
  numberOfMembers,
  numberOfPosts,
  status: initialStatus,
  userId,
  masterUserId,
}: GroupItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleJoinLeaveClick = async () => {
    if (userId === masterUserId || status === "Forbidden" || status === "Pending") return;

    const endpoint = 'https://un-silent-backend-develop.azurewebsites.net/api/groups/join';
    const payload = {
      groupId: id,
      userId: userId,
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (status === "Not joined") {
          setStatus("Pending");
        } else if (status === "Joined") {
          setStatus("Not joined");
        }
        console.log('Join/Leave action successful');
      } else {
        console.error('Failed to join/leave group');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGroupClick = () => {
    if(userId === masterUserId) {
      router.push(`/group/${id}`);
      return;
    }
    
    if (status === "Not joined" || status === "Pending") {
      toast({
        title: "Access Denied",
        description: "You need to join this group first.",
        variant: "destructive",
      });
      return;
    }

    if (isClient) {
      console.log(id);  
      router.push(`/group/${id}`);
    }
  };

  const getButtonText = () => {
    if (userId === masterUserId) return 'Your Group';
    switch (status) {
      case 'Not joined':
        return 'Join group';
      case 'Joined':
        return 'Joined';
      case 'Pending':
        return 'Pending';
      case 'Forbidden':
        return 'Forbidden';
      default:
        return 'Join group';
    }
  };

  return (
    <div className="flex items-center border p-4 rounded-lg">
      <img
        src={groupImage}
        alt="Group"
        className="h-28 w-28 mr-4 rounded-lg cursor-pointer"
        onClick={handleGroupClick}
      />
      <div className="flex-1">
        <h2
          className="font-bold text-lg cursor-pointer"
          onClick={handleGroupClick}
        >
          {groupName}
        </h2>
        <p className="text-sm">{description}</p>
        <div className="flex items-center mt-2">
          <span className="mr-4">
            <img
              src="https://img.icons8.com/?size=100&id=11168&format=png&color=000000"
              alt="Members Icon"
              className="inline-block h-5 w-5 mr-1"
            />
            {numberOfMembers} Members
          </span>
          <span>
            <img
              src="https://img.icons8.com/?size=100&id=115225&format=png&color=000000"
              alt="Posts Icon"
              className="inline-block h-5 w-5 mr-1"
            />
            {numberOfPosts} Posts
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button
          onClick={handleJoinLeaveClick}
          className={`px-4 py-2 rounded mb-2 ${
            userId === masterUserId
              ? 'bg-yellow-400 text-black cursor-not-allowed'
              : status === "Forbidden"
              ? 'bg-red-500 text-white cursor-not-allowed'
              : status === "Pending"
              ? 'bg-blue-300 text-blue-700 cursor-not-allowed'
              : status === "Joined"
              ? 'bg-gray-300 text-gray-700'
              : 'bg-green-500 text-white'
          }`}
          disabled={userId === masterUserId || status === "Forbidden" || status === "Pending"}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
