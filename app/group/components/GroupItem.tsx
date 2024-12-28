"use client";
import React, { useState } from 'react';

interface GroupItemProps {
  id: string;
  groupName: string;
  description: string;
  groupImage: string;
  numberOfMembers: number;
  numberOfPosts: number;
  isJoined: boolean;
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
  isJoined: initialIsJoined,
  userId,
  masterUserId,
}: GroupItemProps) {
  const [isJoined, setIsJoined] = useState(initialIsJoined);

  const handleJoinLeaveClick = async () => {
    if (userId === masterUserId) return;

    const endpoint = 'https://localhost:7282/api/groups/join';
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
        setIsJoined(!isJoined);
      } else {
        console.error('Failed to join/leave group');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGroupClick = () => {
    // Future implementation for navigating to group details
    console.log(`Navigate to group details for group ID: ${id}`);
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
          <span className="mr-4">👥 {numberOfMembers} Members</span>
          <span>📝 {numberOfPosts} Posts</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button
          onClick={handleJoinLeaveClick}
          className={`px-4 py-2 rounded mb-2 ${
            userId === masterUserId
              ? 'bg-blue-300 text-blue-700 cursor-not-allowed'
              : isJoined
              ? 'bg-gray-300 text-gray-700'
              : 'bg-green-500 text-white'
          }`}
          disabled={userId === masterUserId}
        >
          {userId === masterUserId ? 'Your Group' : isJoined ? 'Joined' : 'Join group'}
        </button>
        {/* Hide the "See more" button */}
        {/* <button className="bg-green-100 text-green-700 px-4 py-2 rounded">See more</button> */}
      </div>
    </div>
  );
}
