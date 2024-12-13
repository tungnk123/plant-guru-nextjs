import React, { useState } from "react";
import VoteButton from '../../home/components/VoteButton'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PostResponse } from "@/app/api/postService";
import CommentSection from "@/app/home/components/CommentSection";
import { Comment } from "@/app/api/postService";


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

  const handleShare = () => { }
  const handleMore = () => { }

  const postData = {
    postId: postDat.postId,
    userId: postDat.userId,
    userAvatar: "https://www.gravatar.com/avatar",
    imageUrl: "https://www.gravatar.com/avatar",
    description: postDat.description,
    title: postDat.title,
    userNickName: postDat.userNickName,
    numberOfUpvote: postDat.numberOfUpvote,
    numberOfComment: postDat.numberOfComment,
    numberOfShare: postDat.numberOfShare
  }

  return (
    <div className='w-full rounded-3xl border bg-white p-4 shadow-md'>
      <div className='mb-5 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Image
            src={postData.userAvatar}
            alt={postData.userAvatar}
            width={32}
            height={32}
            className='mr-2 h-8 w-8 rounded-full pointer-events-none select-none'
          />
          <span className='font-semibold text-gray-800'>{postData.userNickName}</span>
        </div>
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-bold text-gray-900'>{postData.title}</h3>
        <p className='line-clamp-3 overflow-hidden text-sm text-gray-600'>
          {postData.description}
        </p>
      </div>

      {/* <Image
        src={imageUrl}
        alt={title}
        height={478}
        width={478}
        className='mb-6 rounded-lg object-cover pointer-events-none select-none'
      /> */}
      <div className="mb-4 flex gap-1">
        <Image
          src={postData.imageUrl}
          alt={postData.imageUrl}
          width={220}
          height={220}
          className="cursor-pointer rounded-md object-cover"
          onClick={() => handleImageClick(postData.imageUrl)}
        />
      </div>

      <div className='flex justify-between text-sm text-gray-500'>
        <div className='flex items-center space-x-2'>
          <VoteButton
            initialVotes={postData.numberOfUpvote}
            postId={postData.postId}
            hasUpvoted={postDat.hasUpvoted} // Pass the prop to indicate upvote state
            hasDevoted={postDat.hasDevoted} // Pass the prop to indicate downvote state
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
            <span>{postData.numberOfComment}</span>
          </Button>

          {/* <Button
            className='flex items-center space-x-1 bg-transparent text-gray-700 shadow-none hover:bg-transparent'
            onClick={handleShare}
          >
            <Image
              src='/images/img_share_icon.svg'
              height={20}
              width={20}
              alt='Share'
              className='h-5 w-5 pointer-events-none select-none'
            />
            <span>{postData.numberOfShare}</span>
          </Button> */}
        </div>

        {/* <Button
          className='bg-transparent text-gray-700 shadow-none hover:bg-transparent'
          onClick={handleMore}
        >
          <Image
            src='/images/img_more_icon.svg'
            height={20}
            width={20}
            alt='More options'
            className='h-5 w-5 pointer-events-none select-none'
          />
        </Button> */}
      </div>

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleModalClose}>
          <div className="relative"
            onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Zoomed Image"
              width={600}
              height={600}
              className="rounded-lg"
            />
            <button
              className="absolute top-1 right-1 text-white"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {isCommentSectionOpen && <CommentSection postId={postData.postId} />}
    </div>
  )
}

export default PostCard
