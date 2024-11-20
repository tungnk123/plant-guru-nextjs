'use client'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Root } from '@/app/api/data/models/ApiResponse'

const PlantIdentifier = () => {
  const [image, setImage] = useState<string | null>(
    '/images/img_upload_image.png'
  )
  const [plantInfo, setPlantInfo] = useState<Root | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

      const response = await fetch(`/api/identify?image=${encodeURIComponent(base64Image)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to identify the plant')
      }

      const data = await response.json()
      setPlantInfo(data)
    } catch (error) {
      console.error('Error identifying plant:', error)
      alert('Failed to identify plant. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
        <p className='mt-4 text-yellow-500'>Identifying the plant...</p>
      )}

      {plantInfo && (
        <div className='mt-8 w-[600px] rounded-md border bg-gray-50 p-4 shadow-md'>
          <h2 className='text-lg font-bold'>
            {plantInfo.result.classification.suggestions[0]?.name}
          </h2>
          <p>
            Probability:{' '}
            {plantInfo.result.classification.suggestions[0]?.probability.toFixed(
              2
            )}
          </p>
          <p>
            Common Names:{' '}
            {plantInfo.result.classification.suggestions[0]?.details.common_names.join(
              ', '
            )}
          </p>
          <p>
            Description:{' '}
            {plantInfo.result.classification.suggestions[0]?.details.description
              ?.value || 'No description available'}
          </p>
        </div>
      )}
    </div>
  )
}

export default PlantIdentifier
