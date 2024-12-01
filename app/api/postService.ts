// postService.ts

export interface PostData {
  title: string;
  description: string;
  userId: string;
  imageUrl: string;
  tag: string;
  background: string;
}

export const createPost = async (postData: PostData): Promise<any> => {
  try {
    const response = await fetch(
      'https://un-silent-backend-develop.azurewebsites.net/api/posts',
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
      // If the response is not OK, throw an error with the message from the response
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }

    // Return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
