// postService.ts

import postParams from './get_post_param.json';

export interface PostData {
  title: string;
  description: string;
  userId: string;
  imageUrl: string;
  tag: string;
  background: string;
}

export interface PostResponse {
  postId: string;
  userId: string;
  userNickName: string;
  userAvatar: string;
  title: string;
  description: string;
  imageUrl: string;
  tag: string;
  background: string;
  numberOfUpvote: number;
  numberOfDevote: number;
  numberOfComment: number;
  numberOfShare: number;
  createdDate: string;
  hasUpvoted: boolean;
  hasDevoted: boolean;
}

export interface FetchPostsResponse {
  posts: PostResponse[];
  totalPages: number;
}

export interface Comment {
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

const BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/posts'

const tagMap = {
  'plants': 'plants',
  'flowers': 'flowers',
  'guides & tips': 'guides',
  'diseases': 'diseases',
  'q&a': 'qna',
  'diy projects': 'diy',
};

const filterMap = {
  trending: 'trending',
  upvote: 'upvote',
  latest: 'time',
};

export const createPost = async (postData: PostData): Promise<any> => {
  try {
    const response = await fetch(
      BASE_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const fetchPosts = async (
  page: number,
  limit: number,
  tag: string,
  filter: string
): Promise<FetchPostsResponse> => {
  try {
    localStorage.setItem('userId', 'b097284d-8ae1-445f-922d-5eb51ebe2326');
    const userId = localStorage.getItem('userId');
    let userIdString = userId ? `userId=${userId}` : '';

    // Map the tag and filter using the defined mappings
    const mappedTag = tagMap[tag.toLowerCase()];
    const mappedFilter = filterMap[filter.toLowerCase()];

    // Construct the URL parameters
    let tagString = mappedTag && mappedTag !== 'all' ? `&tag=${mappedTag}` : '';
    let filterString = mappedFilter && mappedFilter !== 'all' ? `&filter=${mappedFilter}` : '';

    const response = await fetch(`${BASE_URL}?${userIdString}&limit=${limit}&page=${page}${tagString}${filterString}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data || data.length === 0) {
      return {
        posts: [],
        totalPages: 0,
      };
    }
    console.log(`${BASE_URL}?${userIdString}&limit=${limit}&page=${page}${tagString}${filterString}`);
    return {
      posts: data.plantPostDtos,
      totalPages: data.numberOfPage,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const upvotePost = async (targetId: string): Promise<{ numberOfUpvotes: number }> => {
  try {
    const userId = localStorage.getItem('userId')
    const response = await fetch(`${BASE_URL}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({ userId, targetId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to upvote post: ${response.statusText}`);
    }

    const data = await response.json();
    return { numberOfUpvotes: data.numberOfUpvotes };
  } catch (error) {
    console.error('Error upvoting post:', error);
    throw error;
  }
};

export const downvotePost = async (targetId: string): Promise<{ numberOfUpvotes: number }> => {
  try {
    const userId = localStorage.getItem('userId')
    const response = await fetch(`${BASE_URL}/devote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({ userId, targetId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to downvote post: ${response.statusText}`);
    }

    const data = await response.json();
    return { numberOfUpvotes: data.numberOfUpvotes };
  } catch (error) {
    console.error('Error downvoting post:', error);
    throw error;
  }
};

export const fetchComments = async (
  postId: string,
  parentCommentId: string | null = null
): Promise<Comment[]> => {
  try {
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }

    const url = new URL(
      `${BASE_URL}/comments/posts/${postId}/comments`
    );
    url.searchParams.append('userId', userId);
    if (parentCommentId) {
      url.searchParams.append('parentCommentId', parentCommentId);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    const data: Comment[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};


