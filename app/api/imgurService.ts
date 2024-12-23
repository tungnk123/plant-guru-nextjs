export async function uploadImageToImgur(image: File): Promise<string> {
    const clientId = 'df4181f12f0afbd'; // Replace with your Imgur client ID
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'image');
    formData.append('title', 'PlantGURU_PostImg');
    formData.append('description', 'none');
  
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload image to Imgur');
    }
    const data = await response.json();
    console.log(data.data.link);
    return data.data.link; // Return the URL of the uploaded image
  }