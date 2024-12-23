import { log } from "console";

const BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/posts/comments';

export interface CommentData {
  commentId: string;
  userId: string;
  name: string;
  avatar: string;
  message: string;
  createdAt: string;
  numberOfUpvote: number;
  numberOfDevote: number;
  hasUpvoted: boolean;
  hasDevoted: boolean;
}

export interface CommentVoteResponse {
  status: string;
  message: string;
  numberOfUpvotes: number;
  numberOfDevotes: number;
}

export const fetchComments = async (postId: string): Promise<CommentData[]> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments?userId=${userId}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    const data: CommentData[] = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const postComment = async (postId: string, message: string): Promise<CommentData> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify({ postId, userId, message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      commentId: data.commentId,
      userId,
      name: 'Your Name', // Replace with actual user name if available
      avatar: 'your-avatar.png', // Replace with actual avatar if available
      message,
      createdAt: 'Just now',
      numberOfUpvote: 0,
      numberOfDevote: 0,
      hasUpvoted: false,
      hasDevoted: false,
    };
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const upvoteComment = async (commentId: string): Promise<CommentVoteResponse> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  try {
    const response = await fetch(`${BASE_URL}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify({ userId, targetId: commentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upvote comment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error upvoting comment:', error);
    throw error;
  }
};

export const downvoteComment = async (commentId: string): Promise<CommentVoteResponse> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  try {
    const response = await fetch(`${BASE_URL}/devote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify({ userId, targetId: commentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to downvote comment: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error downvoting comment:', error);
    throw error;
  }
}; 

export const postReply = async (parentCommentId: string, message: string): Promise<void> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  try {
    const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/posts/comments/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
      },
      body: JSON.stringify({ parentCommentId, userId, message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post reply: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error posting reply:', error);
    throw error;
  }
};

export const fetchReplies = async (postId: string, parentCommentId: string): Promise<CommentData[]> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User ID not found in localStorage');
  }

  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments?userId=${userId}&parentCommentId=${parentCommentId}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch replies: ${response.statusText}`);
    }

    const data: CommentData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
};