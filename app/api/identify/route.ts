import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('API route received request');

  try {
    const apiKey = 'URWBmEBcg06oPXxGwSF8gE5vqYIosQ7x30gG2I98DOd9dADPzM';
    const apiUrl = 'https://plant.id/api/v3/identification/';
    
    const body = await req.json();
    const { image, latitude = 14.0583, longitude = 108.2772 } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }
    
    const params = new URLSearchParams({
      details: 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
      language: 'vi',
    });

    const fullApiUrl = `${apiUrl}?${params.toString()}`;

    const requestBody = {
      images: [image],
      latitude,
      longitude,
      similar_images: true,
    };

    const response = await fetch(fullApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error(`Plant.id API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: "" }, { status: 500 });
  }
}
