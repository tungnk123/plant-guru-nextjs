import React from 'react';
import VoteButton from './VoteButton';

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
      <div className="border aspect-square w-full rounded-3xl shadow-md p-6 bg-white">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <img
              src={userAvatar}
              alt={userName}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="font-semibold text-gray-800">{userName}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 overflow-hidden line-clamp-3">{description}</p>
        </div>

        <img
          src={imageUrl}
          alt={title}
          className="rounded-lg mb-6 object-cover"
        />

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <VoteButton initialVotes={upvotes}></VoteButton>
            </div>
            <button
              className="flex items-center space-x-1 text-gray-700"
              onClick={handleComment}>
              <img src="/images/img_chat_bubble_icon.svg" alt="Comments" className="w-5 h-5" />
              <span>{comments}</span>
            </button>

            <button
              className="flex items-center space-x-1 text-gray-700"
              onClick={handleShare}>
              <img src="/images/img_share_icon.svg" alt="Share" className="w-5 h-5" />
              <span>{shares}</span>
            </button>
          </div>
          <button
            className="text-gray-700"
            onClick={handleMore}>
            <img src="/images/img_more_icon.svg" alt="More options" className="w-5 h-5" />
          </button>
        </div>
      </div>
  );
};

export default PostCard;