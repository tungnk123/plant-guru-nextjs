import React, { useState } from 'react';

interface VoteButtonProps {
  initialVotes: number;
}

const VoteButton: React.FC<VoteButtonProps> = ({ initialVotes }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);

  const handleUpvote = () => {
    if (isUpvoted) {
      setVotes(votes - 1);
      setIsUpvoted(false);
    } else {
      setVotes(isDownvoted ? votes + 2 : votes + 1);
      setIsUpvoted(true);
      setIsDownvoted(false);
    }
  };

  const handleDownvote = () => {
    if (isDownvoted) {
      setVotes(votes + 1);
      setIsDownvoted(false);
    } else {
      setVotes(isUpvoted ? votes - 2 : votes - 1);
      setIsDownvoted(true);
      setIsUpvoted(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 border border-gray-300">
      <button
        onClick={handleUpvote}
        className={`flex items-center space-x-1 ${isUpvoted ? 'text-green-500' : 'text-gray-500'}`}
      >
        <img src="/images/img_post_upvote.svg" alt="Upvote" className="w-5 h-5" />
        <span>Upvote</span>
      </button>
      <span className="text-black font-medium">{votes}</span>
      <div className="w-px h-5 bg-gray-300" />
      <button
        onClick={handleDownvote}
        className={`flex items-center space-x-1 ${isDownvoted ? 'text-red-500' : 'text-gray-500'}`}
      >
        <img src="/images/img_post_downvote.svg" alt="Downvote" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default VoteButton;