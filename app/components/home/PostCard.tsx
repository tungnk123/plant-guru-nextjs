import React, { useState } from "react";
import VoteButton from '../../home/components/VoteButton'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PostResponse } from "@/app/api/postService";
import CommentSection from "@/app/home/components/CommentSection";
import UserComponent from '../UserComponent';

const PostCard: React.FC<PostResponse> = (postDat) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCommentSectionOpen, setCommentSectionOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleCommentClick = () => {
    setCommentSectionOpen((prev) => !prev);
  };

  const handleUserClick = () => {
    // Define the action to perform when the user component is clicked
    console.log(`User ${postDat.userNickName} clicked`);
  };

  const renderImages = () => {
    const imageCount = postDat.images.length;

    if (imageCount <= 3) {
      return postDat.images.map((imageUrl, index) => (
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
          {postDat.images.slice(0, 3).map((imageUrl, index) => (
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
              src={postDat.images[3]}
              alt="Image 3"
              width={220}
              height={220}
              className="cursor-pointer rounded-md object-cover"
              onClick={() => handleImageClick(postDat.images[3])}
            />
            {imageCount > 4 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold cursor-pointer"
                onClick={() => handleImageClick(postDat.images[3])}
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
    <div className='w-full rounded-3xl border bg-white p-4 shadow-md'>
      <div className='mb-5 flex items-center justify-between'>
        <UserComponent
          avatar={postDat.userAvatar}
          name={postDat.userNickName}
          userId={postDat.userId}
        />
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-bold text-gray-900'>{postDat.title}</h3>
        <p className='line-clamp-3 overflow-hidden text-sm text-gray-600'>
          {postDat.description}
        </p>
      </div>

      <div className="mb-4 flex gap-1">
        {renderImages()}
      </div>

      <div className='flex justify-between text-sm text-gray-500'>
        <div className='flex items-center space-x-2'>
          <VoteButton
            initialVotes={postDat.numberOfUpvote}
            postId={postDat.postId}
            hasUpvoted={postDat.hasUpvoted}
            hasDevoted={postDat.hasDevoted}
          />

          <Button
            className='flex items-center space-x-1 bg-transparent text-gray-700 shadow-none hover:bg-transparent'
            onClick={handleCommentClick}
          >
            <Image
              src='/images/img_chat_bubble_icon.svg'
              height={20}
              width={20}
              alt='Comments'
              className='h-5 w-5 pointer-events-none select-none'
            />
            <span>{postDat.numberOfComment}</span>
          </Button>
        </div>
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
            {postDat.images.map((imageUrl, index) => (
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
      {isCommentSectionOpen && <CommentSection postId={postDat.postId} />}
    </div>
  )
}

export default PostCard
