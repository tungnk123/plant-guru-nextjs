// postService.ts

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
}

export interface FetchPostsResponse {
  posts: PostResponse[];
  totalPages: number;
}

const BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/posts'

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
    const response = await fetch(`${BASE_URL}?limit=${limit}&page=${page}&tag=${tag}&filter=${filter}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`${BASE_URL}?limit=${limit}&page=${page}&tag=${tag}&filter=${filter}`)
    return {
      posts: data,
      totalPages: 10,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};


