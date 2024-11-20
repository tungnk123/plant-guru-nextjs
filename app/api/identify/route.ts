import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  console.log('API route received request');

  try {
    const apiKey = 'URWBmEBcg06oPXxGwSF8gE5vqYIosQ7x30gG2I98DOd9dADPzM';
    const accessToken = 'oSAXvYedP4NPS7a';
    const apiUrl = `https://plant.id/api/v3/identification/${accessToken}?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering&language=vi`;

    const url = new URL(req.url);
    const base64Image = url.searchParams.get('image');

    if (!base64Image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
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
    return NextResponse.json({ error: 'Internal Server Error', message: '' }, { status: 500 });
  }
}
