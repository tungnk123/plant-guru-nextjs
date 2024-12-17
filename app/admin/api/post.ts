import { Post } from "@/constants/data";
import { da } from "@faker-js/faker";

// Fetch all posts
export async function fetchPosts({ page, limit }: { page: number; limit: number }) {
  console.log('Start call API:');
  const response = await fetch(
    `https://un-silent-backend-develop.azurewebsites.net/api/posts/test/get-all`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response:', data);

  return {
    totalPosts: data.length,
    posts: data,
  };
}

// Approve a specific post
export async function approvePost(postId: string) {
  console.log('Start call API to approve post:', postId);
  
  const response = await fetch(
    `https://un-silent-backend-develop.azurewebsites.net/api/admin/approvePost`,
    {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    throw new Error(`Failed to approve post: ${errorData.detail || response.statusText}`);
  }

  const data = await response;
  console.log('Post approved successfully:', data);

  return data;
}

// Unapprove a specific post
export async function unApprovePost(postId: string) {
  console.log('Start call API to unapprove post:', postId);

  const response = await fetch(
    `https://un-silent-backend-develop.azurewebsites.net/api/admin/unApprovePost`,
    {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }), // Payload with the postId
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    throw new Error(`Failed to unapprove post: ${errorData.detail || response.statusText}`);
  }

  const data = await response;
  console.log('Post unapproved successfully:', data);

  return data; // Return the unapproved post data or any success response
}

export async function fetchUnapprovedPosts() {
  console.log('Start call API to fetch all unapproved posts');

  const response = await fetch(
    `https://un-silent-backend-develop.azurewebsites.net/api/admin/unApprovePosts`,
    {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch unapproved posts: ${response.statusText}`);
  }

  const rawData = await response.json();
  console.log('Fetched unapproved posts:', rawData);

  const posts = transformPostData(rawData);
  return {
    totalPosts: posts.length,
    posts,
  };
}


export function transformPostData(rawPosts: any[]): Post[] {
  return rawPosts.map((post) => ({
    id: post.postId,
    userId: post.userId,
    userNickName: post.userNickName || '', // Default to empty string
    userAvatar: post.userAvatar || 'img_default_avatar.png', // Default avatar
    title: post.title,
    description: post.description,
    imageUrl: post.imageUrl || 'img_default_post.png', // Default image
    tag: post.tag,
    background: post.background || 'img_default_post.png',
    postUpvotes: post.numberOfUpvote || 0,
    postDevotes: post.numberOfDevote || 0,
    postComments: post.numberOfComment || 0,
    postShares: post.numberOfShare || 0,
    createdAt: post.createdDate || '0001-01-01T00:00:00', // Fallback for invalid dates
  }));
}


