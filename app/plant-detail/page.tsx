'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface PlantDetails {
  result?: {
    name: string
    description: string
    common_names: string[]
    image?: string
  }
}

const Page = () => {
  const [detailData, setDetailData] = useState<PlantDetails | null>(null)
  const searchParams = useSearchParams()
  const data = searchParams.get('data')

  useEffect(() => {
    if (data) {
      try {
        // Parse the data string from the query parameters
        const parsedData = JSON.parse(data)

        // Update the state with relevant information from the parsed data
        setDetailData({
          result: {
            name: parsedData.name,
            description: parsedData.details?.description?.value || 'No description.',
            common_names: parsedData.details?.common_names || [],
            image: parsedData.details?.image?.value || '',
          }
        })
      } catch (e) {
        console.error('Error parsing data:', e)
      }
    }
  }, [data])

  if (!detailData) {
    return <p>Loading...</p>
  }

  return (
    <div className='min-h-screen p-6 bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Plant Details</h1>
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold'>
          {detailData.result?.name || 'Unknown Plant'}
        </h2>
        <p className='text-gray-600 mt-2'>
          Description: {detailData.result?.description}
        </p>
        <p className='text-gray-600 mt-2'>
          Common Names: {detailData.result?.common_names.join(', ') || 'N/A'}
        </p>
        {detailData.result?.image && (
          <div className='mt-4'>
            <img
              src={detailData.result.image}
              alt={detailData.result.name}
              className='max-w-full h-auto'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
