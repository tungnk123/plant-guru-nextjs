import React, { useState } from "react";
import VoteButton from './VoteButton'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export interface PostCardProps {
  userName: string
  userAvatar: string
  title: string
  description: string
  imageUrls: string[]
  upvotes: number
  comments: number
  shares: number
}

const PostCard: React.FC<PostCardProps> = ({
  userName,
  userAvatar,
  title,
  description,
  imageUrls,
  upvotes,
  comments,
  shares
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };
  const handleComment = () => { }
  const handleShare = () => { }
  const handleMore = () => { }

  return (
    <div className='w-full rounded-3xl border bg-white p-4 shadow-md'>
      <div className='mb-5 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Image
            src={userAvatar}
            alt={userName}
            width={32}
            height={32}
            className='mr-2 h-8 w-8 rounded-full pointer-events-none select-none'
          />
          <span className='font-semibold text-gray-800'>{userName}</span>
        </div>
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
        <p className='line-clamp-3 overflow-hidden text-sm text-gray-600'>
          {description}
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
        {imageUrls.slice(0, 2).map((imageUrl, index) => (
          <Image
            key={index}
            src={imageUrl}
            alt={`Image ${index + 1}`}
            width={220}
            height={220}
            className="cursor-pointer rounded-md object-cover"
            onClick={() => handleImageClick(imageUrl)}
          />
        ))}
      </div>

      <div className='flex justify-between text-sm text-gray-500'>
        <div className='flex items-center space-x-2'>
          <VoteButton initialVotes={upvotes} />

          <Button
            className='flex items-center space-x-1 bg-transparent text-gray-700 shadow-none hover:bg-transparent'
            onClick={handleComment}
          >
            <Image
              src='/images/img_chat_bubble_icon.svg'
              height={20}
              width={20}
              alt='Comments'
              className='h-5 w-5 pointer-events-none select-none'
            />
            <span>{comments}</span>
          </Button>

          <Button
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
            <span>{shares}</span>
          </Button>
        </div>

        <Button
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
        </Button>
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
    </div>
  )
}

export default PostCard
