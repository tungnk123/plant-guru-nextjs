"use client";
import React, { useState } from "react";
import Image from 'next/image';
import { PostResponse } from "@/app/api/postService";

interface PostPendingCardProps extends PostResponse {
  onApprove: () => void;
}

const PostPendingCard: React.FC<PostPendingCardProps> = ({ onApprove, ...postData }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleApprove = async () => {
    try {
      const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/groups/posts/approvePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postData.postId }),
      });

      if (response.ok) {
        console.log(`Post approved: ${postData.postId}`);
        onApprove(); // Call the callback to refresh the list
      } else {
        console.error('Failed to approve post');
      }
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleDelete = () => {
    // Logic to delete the post
    console.log(`Deleting post: ${postData.postId}`);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const renderImages = () => {
    const imageCount = postData.images.length;

    if (imageCount <= 3) {
      return postData.images.map((imageUrl, index) => (
        <Image
          key={index}
          src={imageUrl}
          alt={`Image ${index}`}
          width={220}
          height={220}
          className="cursor-pointer rounded-md object-cover"
          onClick={() => handleImageClick(imageUrl)}
        />
      ));
    }

    if (imageCount > 3) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {postData.images.slice(0, 3).map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Image ${index}`}
              width={220}
              height={220}
              className="cursor-pointer rounded-md object-cover"
              onClick={() => handleImageClick(imageUrl)}
            />
          ))}
          <div className="relative">
            <Image
              src={postData.images[3]}
              alt="Image 3"
              width={220}
              height={220}
              className="cursor-pointer rounded-md object-cover"
              onClick={() => handleImageClick(postData.images[3])}
            />
            {imageCount > 4 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold"
                onClick={() => handleImageClick(postData.images[3])}
              >
                +{imageCount - 4 + 1}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className='w-full rounded-3xl border bg-white p-4 shadow-md flex justify-between'>
      <div>
        <div className='mb-5 flex items-center'>
          <Image
            src={postData.userAvatar}
            alt={postData.userAvatar}
            width={32}
            height={32}
            className='mr-2 h-8 w-8 rounded-full pointer-events-none select-none'
          />
          <span className='font-semibold text-gray-800'>{postData.userNickName}</span>
        </div>

        <div className='mb-6'>
          <h3 className='text-lg font-bold text-gray-900'>{postData.title}</h3>
          <p className='line-clamp-3 overflow-hidden text-sm text-gray-600'>
            {postData.description}
          </p>
        </div>

        <div className="mb-4 flex gap-1">
          {renderImages()}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button
          onClick={handleApprove}
          className="w-full px-4 py-2 bg-green-500 text-white rounded mb-2"
        >
          Approve
        </button>
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75"
          onClick={handleModalClose}>
          <div className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Zoomed Image"
              width={600}
              height={600}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <button
              className="absolute top-1 right-1 text-white"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </div>
          <div className="mt-4 flex space-x-2">
            {postData.images.map((imageUrl, index) => (
              <Image
                key={index}
                src={imageUrl}
                alt={`Thumbnail ${index}`}
                width={100}
                height={100}
                className="cursor-pointer rounded-md object-cover"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(imageUrl);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPendingCard; 