import React from 'react'
import VoteButton from './VoteButton'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface PostCardProps {
  userName: string
  userAvatar: string
  title: string
  description: string
  imageUrl: string
  upvotes: number
  comments: number
  shares: number
}

const PostCard: React.FC<PostCardProps> = ({
  userName,
  userAvatar,
  title,
  description,
  imageUrl,
  upvotes,
  comments,
  shares
}) => {
  const handleComment = () => {}
  const handleShare = () => {}
  const handleMore = () => {}

  return (
    <div className='aspect-square w-full rounded-3xl border bg-white p-4 shadow-md'>
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
        <Button className='bg-transparent text-gray-400 shadow-none hover:bg-transparent pointer-events-none select-none'>
          ✕
        </Button>
      </div>

      <div className='mb-6'>
        <h3 className='text-lg font-bold text-gray-900'>{title}</h3>
        <p className='line-clamp-3 overflow-hidden text-sm text-gray-600'>
          {description}
        </p>
      </div>

      <Image
        src={imageUrl}
        alt={title}
        height={478}
        width={478}
        className='mb-6 rounded-lg object-cover pointer-events-none select-none'
      />

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
    </div>
  )
}

export default PostCard
