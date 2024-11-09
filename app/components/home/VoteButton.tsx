import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
    <div className="flex items-center space-x-2 rounded-full bg-gray-100 border border-gray-300">
      <Button
        onClick={handleUpvote}
        className={`flex items-center bg-transparent shadow-none hover:bg-transparent ${isUpvoted ? 'text-green-500' : 'text-gray-500'}`}
      >
        <Image src="/images/img_post_upvote.svg" height={20} width={20} alt="Upvote" className="" />
        <span>Upvote</span>
      </Button>
      <span className="text-black font-medium">{votes}</span>
      <div className="w-px h-5 bg-gray-300" />
      <Button
        onClick={handleDownvote}
        className={`relative flex items-center w-10 h-10 p-0 bg-transparent shadow-none hover:bg-transparent ${
          isDownvoted ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        <div className="relative w-5 h-5">
          <Image
            src="/images/img_post_downvote.svg"
            alt="Downvote"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </Button>
    </div>
  );
};

export default VoteButton;