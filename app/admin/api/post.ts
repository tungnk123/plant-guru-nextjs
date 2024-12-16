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
      body: JSON.stringify({ postId }), // Payload with the postId
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('API Error:', errorData);
    throw new Error(`Failed to approve post: ${errorData.detail || response.statusText}`);
  }

  const data = await response.json();
  console.log('Post approved successfully:', data);

  return data; // Return the approved post data or any success response
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

  const data = await response.json();
  console.log('Post unapproved successfully:', data);

  return data; // Return the unapproved post data or any success response
}

