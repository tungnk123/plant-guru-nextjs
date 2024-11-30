'use client';
import { useEffect, useState } from 'react';

interface PlantDetails {
  name: string;
  description: string;
  common_names: string[];
  synonyms: string[];
  taxonomy: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
  };
  image: string;
  url: string;
  edible_parts: string[];
  gbif_id: number;
  inaturalist_id: number;
  rank: string;
  probability: number;
  lifespan?: string;
  bloom_time?: string;
  flower_color?: string;
  ideal_temperature?: string;
  plant_type?: string;
  leaf_color?: string;
}

const getRandomValue = (values: string[]) =>
  values[Math.floor(Math.random() * values.length)];

const getRandomTemperature = () =>
  `${Math.floor(Math.random() * (40 - 15) + 15)} - ${Math.floor(
    Math.random() * (40 - 15) + 15
  )} ℃`;

const Page = () => {
  const [detailData, setDetailData] = useState<PlantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get('data');

    if (data) {
      try {
        const decodedData = decodeURIComponent(decodeURIComponent(data));
        const parsedData = JSON.parse(decodedData);

        setDetailData({
          ...parsedData,
          lifespan: getRandomValue(['Annual', 'Perennial', 'Biennial']),
          bloom_time: getRandomValue([
            'Spring',
            'Summer',
            'Fall',
            'Winter',
            'Year-Round',
          ]),
          flower_color: getRandomValue([
            'Yellow',
            'White',
            'Green',
            'Red',
            'Blue',
            'Purple',
          ]),
          ideal_temperature: getRandomTemperature(),
          plant_type: getRandomValue(['Herb', 'Shrub', 'Tree', 'Grass', 'Vine']),
          leaf_color: getRandomValue([
            'Green',
            'Dark Green',
            'Light Green',
            'Yellow',
            'Red',
          ]),
        });
      } catch (e) {
        console.error('Error parsing data:', e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Plant Details</h1>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">{detailData.name}</h2>
        <p className="text-gray-600 mt-2">
          <strong>Description:</strong> {detailData.description}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Common Names:</strong>{' '}
          {detailData.common_names.join(', ') || 'N/A'}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Synonyms:</strong> {detailData.synonyms.join(', ') || 'N/A'}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Edible Parts:</strong> {detailData.edible_parts.join(', ') || 'N/A'}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Probability:</strong> {(detailData.probability * 100).toFixed(2)}%
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Rank:</strong> {detailData.rank}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>GBIF ID:</strong> {detailData.gbif_id}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>iNaturalist ID:</strong> {detailData.inaturalist_id}
        </p>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Scientific Classification</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-600">
            <div>
              <p><strong>Lifespan:</strong> {detailData.lifespan}</p>
            </div>
            <div>
              <p><strong>Plant Type:</strong> {detailData.plant_type}</p>
            </div>
            <div>
              <p><strong>Bloom Time:</strong> {detailData.bloom_time}</p>
            </div>
            <div>
              <p><strong>Leaf Color:</strong> {detailData.leaf_color}</p>
            </div>
            <div>
              <p><strong>Flower Color:</strong> {detailData.flower_color}</p>
            </div>
            <div>
              <p><strong>Ideal Temperature:</strong> {detailData.ideal_temperature}</p>
            </div>
          </div>
        </div>
        {detailData.image && (
          <div className="mt-4">
            <img
              src={detailData.image}
              alt={detailData.name}
              className="max-w-full h-auto rounded-md shadow-md"
            />
          </div>
        )}
        <p className="text-gray-600 mt-4">
          <strong>More Info:</strong>{' '}
          <a
            href={detailData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {detailData.url}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
