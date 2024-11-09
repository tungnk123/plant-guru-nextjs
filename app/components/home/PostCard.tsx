import React from 'react';
import VoteButton from './VoteButton';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  userName: string;
  userAvatar: string;
  title: string;
  description: string;
  imageUrl: string;
  upvotes: number;
  comments: number;
  shares: number;
}

const PostCard: React.FC<PostCardProps> = ({
  userName,
  userAvatar,
  title,
  description,
  imageUrl,
  upvotes,
  comments,
  shares,
}) => {

  const handleComment = () => {

  };

  const handleShare = () => {

  };

  const handleMore = () => {

  };

  return (
    <div className="border aspect-square w-full rounded-3xl shadow-md p-4 bg-white">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Image
            src={userAvatar}
            alt={userName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold text-gray-800">{userName}</span>
        </div>
        <Button className="text-gray-400 bg-transparent shadow-none hover:bg-transparent">✕</Button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 overflow-hidden line-clamp-3">{description}</p>
      </div>

      <Image
        src={imageUrl}
        alt={title}
        height={478}
        width={478}
        className="rounded-lg mb-6 object-cover"
      />

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <VoteButton initialVotes={upvotes}></VoteButton>
          </div>
          <Button
            className="flex items-center space-x-1 bg-transparent shadow-none hover:bg-transparent text-gray-700"
            onClick={handleComment}>
            <Image src="/images/img_chat_bubble_icon.svg" height={20} width={20} alt="Comments" className="w-5 h-5" />
            <span>{comments}</span>
          </Button>

          <Button
            className="flex items-center space-x-1 bg-transparent shadow-none hover:bg-transparent text-gray-700"
            onClick={handleShare}>
            <Image src="/images/img_share_icon.svg" height={20} width={20} alt="Share" className="w-5 h-5" />
            <span>{shares}</span>
          </Button>
        </div>
        <Button
          className="text-gray-700 bg-transparent shadow-none hover:bg-transparent"
          onClick={handleMore}>
          <div className="relative w-5 h-5">
            <Image src="/images/img_more_icon.svg" height={20} width={20} alt="More options" className="w-5 h-5" />
          </div>

        </Button>
      </div>
    </div>
  );
};

export default PostCard;