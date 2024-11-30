'use client'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { Root } from '@/app/api/data/models/ApiResponse'
import { Details } from '@/app/api/data/models/DetailApiDetectPlant'

const PlantIdentifier = () => {
  const [image, setImage] = useState<string | null>(
    '/images/img_upload_image.png'
  )
  const [plantInfo, setPlantInfo] = useState<Root | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlantDetails, setSelectedPlantDetails] = useState<Details | null>(null)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      await identifyPlant(file)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      await identifyPlant(file)
    }
  }

  const identifyPlant = async (file: File) => {
    setIsLoading(true)
    const reader = new FileReader()
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result?.toString() || '')
      reader.onerror = error => reject(error)
    })
    reader.readAsDataURL(file)

    try {
      const base64Image = await base64Promise

      const apiKey = 'URWBmEBcg06oPXxGwSF8gE5vqYIosQ7x30gG2I98DOd9dADPzM'
      const apiUrl = 'https://plant.id/api/v3/identification'
      const params = new URLSearchParams({
        details:
          'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
        language: 'vi'
      })

      const fullApiUrl = `${apiUrl}?${params.toString()}`

      const requestBody = {
        images: [base64Image],
        latitude: 14.0583,
        longitude: 108.2772,
        similar_images: true
      }

      const response = await fetch(fullApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error('Failed to identify the plant via Plant.id API')
      }

      const data = await response.json()
      setPlantInfo(data)
    } catch (error) {
      console.error('Error calling Plant.id API directly:', error)
      alert('Failed to identify plant directly. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPlantDetails = async (accessToken: string) => {
    // accessToken = "oSAXvYedP4NPS7a"
    console.log("Current access tolen:" + accessToken)
    const apiKey = 'URWBmEBcg06oPXxGwSF8gE5vqYIosQ7x30gG2I98DOd9dADPzM'
    const apiUrl = `https://plant.id/api/v3/identification/${accessToken}`
    const params = new URLSearchParams({
      details:
        'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering',
      language: 'vi'
    })
    
    try {
      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch plant details.')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching plant details:', error)
      alert('Failed to fetch plant details. Please try again.')
    }
  }

  const handleViewDetails = async (accessToken: string) => {
    const details = await fetchPlantDetails(accessToken)
    console.log(details)
    setSelectedPlantDetails(details)
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-white'>
      <h1 className='mt-4 text-2xl font-bold text-gray-800'>
        Identify Plants for free
      </h1>
      <p className='mt-2 max-w-md text-center text-sm text-gray-600'>
        Instantly identify plants, flowers, and trees. Explore gardening tips,
        detailed care guides, and the plant world around you.
      </p>

      <div
        className='mt-4 flex w-[600px] flex-col items-center rounded-lg border-2 border-black bg-[#80FF0022] p-6 shadow-md'
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className='mb-4 flex h-[250px] w-[250px] items-center justify-center rounded-md bg-gray-100'>
          {image ? (
            <img
              src={image}
              alt='Uploaded'
              className='h-full w-full rounded-md object-cover'
            />
          ) : (
            <p className='text-gray-500'>Drop an image here</p>
          )}
        </div>
        <p>or drag and drop an image</p>

        <div className='mt-4'>
          <label
            htmlFor='file-upload'
            className='flex cursor-pointer items-center gap-2 rounded-lg bg-yellow-300 px-4 py-2 text-black hover:bg-yellow-600'
          >
            <Upload className='h-5 w-5' />
            Upload an image
          </label>
          <input
            id='file-upload'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {isLoading && (
        <div className='mt-4 flex items-center gap-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent'></div>
          <p className='text-yellow-500'>Identifying the plant...</p>
        </div>
      )}

      {plantInfo && plantInfo.result.classification?.suggestions?.length > 0 ? (
        <div className='mt-8 w-[600px] rounded-md border bg-gray-50 p-4 shadow-md'>
          <h2 className='mb-4 text-lg font-bold'>
            Plant Identification Results
          </h2>
          {plantInfo.result.classification.suggestions.map(
            (suggestion, index) => (
              <div
                key={index}
                className='mb-4 flex cursor-pointer items-center gap-4 rounded-md border bg-white p-4 shadow-sm'
              >
                <Image
                  src={
                    suggestion.details?.image.value ||
                    '/images/placeholder.png'
                  }
                  alt={suggestion.name || 'Unknown'}
                  width={64}
                  height={64}
                  className='h-16 w-16 rounded-md border object-cover'
                />
                <div>
                  <p className='text-lg font-bold'>
                    {suggestion.name || 'Unknown Plant'}
                  </p>
                  <p>
                    Probability: {(suggestion.probability * 100).toFixed(2)}%
                  </p>
                </div>

                <button
                  onClick={() => handleViewDetails(suggestion.details.entity_id)}
                  className='text-blue-500 hover:underline'
                >
                  View Details
                </button>
              </div>
            )
          )}
        </div>
      ) : (
        <p className='mt-8 text-gray-500'>No plant information found.</p>
      )}

      {selectedPlantDetails && (
        <div className='mt-8 w-[600px] rounded-md border bg-gray-50 p-4 shadow-md'>
          <h2 className='mb-4 text-lg font-bold'>Detailed Information</h2>
          <p>
            <strong>Common Names:</strong>{' '}
            {selectedPlantDetails.commonNames?.length > 0
              ? selectedPlantDetails.commonNames.join(', ')
              : 'Not available'}
          </p>
          <p>
            <strong>Description:</strong>{' '}
            {selectedPlantDetails.description?.value || 'Not available'}
          </p>
          <p>
            <strong>Taxonomy:</strong>{' '}
            {selectedPlantDetails.taxonomy?.genus
              ? `${selectedPlantDetails.taxonomy.genus} (${selectedPlantDetails.taxonomy.family || 'Unknown'})`
              : 'Not available'}
          </p>
          <p>
            <strong>Edible Parts:</strong>{' '}
            {selectedPlantDetails.edibleParts?.length > 0
              ? selectedPlantDetails.edibleParts.join(', ')
              : 'None'}
          </p>
        </div>
      )}
    </div>
  )
}

export default PlantIdentifier
