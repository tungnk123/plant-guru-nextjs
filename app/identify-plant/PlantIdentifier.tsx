import Link from 'next/link';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';

const PlantIdentifier = () => {
  const [image, setImage] = useState<string | null>(
    '/images/img_upload_image.png'
  );
  const [plantInfo, setPlantInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await identifyPlant(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      await identifyPlant(file);
    }
  };

  const identifyPlant = async (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = error => reject(error);
    });
    reader.readAsDataURL(file);

    try {
      const base64Image = await base64Promise;

      const apiKey = 'URWBmEBcg06oPXxGwSF8gE5vqYIosQ7x30gG2I98DOd9dADPzM';
      const apiUrl = 'https://plant.id/api/v3/identification';
      const params = new URLSearchParams({
        details:
          'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
        language: 'en',
      });

      const fullApiUrl = `${apiUrl}?${params.toString()}`;

      const requestBody = {
        images: [base64Image],
        latitude: 14.0583,
        longitude: 108.2772,
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
        throw new Error('Failed to identify the plant via Plant.id API');
      }

      const data = await response.json();
      setPlantInfo(data);
    } catch (error) {
      console.error('Error calling Plant.id API directly:', error);
      alert('Failed to identify plant directly. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white relative overflow-hidden">
      <h1 className="mt-4 text-2xl font-bold text-gray-800">
        Identify Plants for free
      </h1>
      <p className="mt-2 max-w-md text-center text-sm text-gray-600">
        Instantly identify plants, flowers, and trees. Explore gardening tips,
        detailed care guides, and the plant world around you.
      </p>

      {/* Container for upload section and results */}
      <div className="flex w-full mt-8 justify-center items-start transition-all duration-500 ease-in-out relative">
        {/* Upload Section */}
        <div
          className={`transition-transform duration-500 ease-in-out ${plantInfo ? '-translate-x-[15%]' : 'translate-x-0'
            } flex w-[400px] flex-col items-center rounded-lg border-2 border-black bg-[#80FF0022] p-6 shadow-md`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="mb-4 flex h-[250px] w-[250px] items-center justify-center rounded-md bg-gray-100">
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <p className="text-gray-500">Drop an image here</p>
            )}
          </div>
          <p>or drag and drop an image</p>

          <div className="mt-4">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-yellow-300 px-4 py-2 text-black hover:bg-yellow-600"
            >
              <Upload className="h-5 w-5" />
              Upload an image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>


        {/* Separator */}
        <div
          className="w-[1px] bg-gray-500 h-[500px] mx-8 transition-opacity duration-500 ease-in-out"
          style={{
            height: `${Math.min(
              (plantInfo?.result?.classification?.suggestions?.length || 0),
              5
            ) * 84}px`, // 84px per item height including margin
          }}
        ></div>

        {/* Identification Results Section */}
        {plantInfo && (
          <div className="ml-16 w-[500px] transition-transform duration-500 ease-in-out">
            <div className="rounded-md bg-white p-4 ">
              <h2 className="text-center mb-4 text-lg font-bold">
                Identification Result
              </h2>
              {plantInfo.result.classification.suggestions.slice(0, 5).map(
                (suggestion: any, index: number) => (
                  <div
                    key={index}
                    className="mb-4 flex items-center justify-between p-4 rounded-lg bg-[#80FF00] shadow-md cursor-pointer hover:ring-2 hover:ring-blue-400"
                    onClick={() =>
                      window.location.href = `/plant-detail/?data=${encodeURIComponent(
                        JSON.stringify({
                          name: suggestion.name || 'Unknown Plant',
                          description:
                            suggestion.details?.description?.value ||
                            'No description available.',
                          common_names: suggestion.details?.common_names || [],
                          synonyms: suggestion.details?.synonyms || [],
                          taxonomy: suggestion.details?.taxonomy || {},
                          image: suggestion.details?.image?.value || '',
                          url: suggestion.details?.url || '',
                          edible_parts: suggestion.details?.edible_parts || [],
                          gbif_id: suggestion.details?.gbif_id || 0,
                          inaturalist_id:
                            suggestion.details?.inaturalist_id || 0,
                          rank: suggestion.details?.rank || '',
                          probability: suggestion.probability || 0,
                        })
                      )}`
                    }
                  >
                    <Image
                      src={
                        suggestion.details?.image?.value ||
                        '/images/placeholder.png'
                      }
                      alt={suggestion.name || 'Unknown'}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full border object-cover"
                    />
                    {/* Name */}
                    <div className="flex-grow ml-4">
                      <p className="text-lg font-bold text-black">{suggestion.name || 'Unknown Plant'}</p>
                    </div>
                    {/* Percentage */}
                    <div className="text-lg font-bold text-black">
                      {(suggestion.probability * 100).toFixed(0)}%
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
          <p className="text-yellow-500">Identifying the plant...</p>
        </div>
      )}
    </div>
  );
};

export default PlantIdentifier;
