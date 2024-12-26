import { downvotePost, upvotePost } from '@/app/api/postService';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchUserById } from '@/app/admin/api/user';

interface VoteButtonProps {
  initialVotes: number;
  postId: string;
  hasUpvoted: boolean;
  hasDevoted: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({ initialVotes, postId, hasUpvoted, hasDevoted }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [upvoted, setUpvoted] = useState(hasUpvoted);
  const [devoted, setDevoted] = useState(hasDevoted);
  const { toast } = useToast();

  const isUserLoggedIn = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const user = await fetchUserById(userId);
      return !!user;
    } catch {
      return false;
    }
  };

  const handleUpvote = async () => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to upvote.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { numberOfUpvotes } = await upvotePost(postId);
      setVotes(numberOfUpvotes);
      setUpvoted(!upvoted);
      setDevoted(false);
    } catch (error) {
      console.error('Error handling upvote:', error);
    }
  };

  const handleDownvote = async () => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to downvote.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { numberOfUpvotes } = await downvotePost(postId);
      setVotes(numberOfUpvotes);
      setUpvoted(false);
      setDevoted(!devoted);
    } catch (error) {
      console.error('Error handling downvote:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2 rounded-full bg-gray-100 border border-gray-300">
      <Button
        onClick={handleUpvote}
        className={`flex items-center bg-transparent shadow-none hover:bg-transparent text-gray-500 ${upvoted ? 'text-blue-500 font-bold' : ''
          }`}
      >
        <Image src="/images/img_post_upvote.svg" height={20} width={20} alt="Upvote" />
        <span>Upvote</span>
      </Button>
      <span className="text-black font-medium">{votes}</span>
      <div className="w-px h-5 bg-gray-300" />
      <Button
        onClick={handleDownvote}
        className={`flex items-center bg-transparent shadow-none hover:bg-transparent text-gray-500 ${devoted ? 'text-red-500 font-bold' : ''
          }`}
      >
        <Image src="/images/img_post_downvote.svg" height={20} width={20} alt="Downvote" />
      </Button>
    </div>
  );
};

export default VoteButton;