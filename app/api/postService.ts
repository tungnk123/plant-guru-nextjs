export interface PostData {
  title: string
  description: string
  userId: string
  imageUrl: string
  tag: string
  background: string
}

// app/api/postService.ts
export const createPost = async (postData: PostData) => {
  const url = 'https://ec9cc5c5-52a4-4a84-b5cf-5e74e57a2275.mock.pstmn.io/posts'

  console.log('Sending data to API:', postData)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })

    console.log('API response:', response)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error Response:', errorData)
      throw new Error(errorData.message || 'Failed to create post')
    }

    const responseData = await response.json()
    console.log('Success Response Data:', responseData)

    return responseData
  } catch (error) {
    console.error('Error while calling API:', error)
    throw new Error(error instanceof Error ? error.message : 'Unknown error')
  }
}
