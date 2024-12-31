"use client";
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CreateGroupModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose, userId }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGroupImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!groupImage) {
      console.error('No image selected');
      return;
    }

    try {
      // Upload image
      const formData = new FormData();
      formData.append('image', groupImage);

      const imageResponse = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 546c25a59c58ad7'
        },
        body: formData
      });

      const imageData = await imageResponse.json();
      if (!imageData.success) {
        console.error('Failed to upload image:', imageData);
        return;
      }

      const imageUrl = imageData.data.link;

      // Create group
      const groupResponse = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName,
          masterUserId: userId,
          description: groupDescription,
          groupImage: imageUrl,
        }),
      });

      if (!groupResponse.ok) {
        console.error('Failed to create group');
        toast({
          title: "Error",
          description: "Failed to create group",
          variant: "destructive"
        });
        return;
      }

      console.log('Group created successfully');
      toast({
        title: "Group Created",
        description: "Your group has been successfully created!",
        variant: "success"
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setGroupName('');
    setGroupDescription('');
    setGroupImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-1/2">
        <h2 className="text-xl font-bold mb-4">Create Group</h2>
        <div className="flex">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block font-medium">Group name *</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-medium">Group description *</label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
          <div className="ml-4">
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
              {groupImage ? (
                <img
                  src={URL.createObjectURL(groupImage)}
                  alt="Group"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>No Image</span>
              )}
            </div>
            <input type="file" onChange={handleImageChange} className="mt-2" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2 px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">Create</button>
        </div>
      </div>
    </div>
  );
}
