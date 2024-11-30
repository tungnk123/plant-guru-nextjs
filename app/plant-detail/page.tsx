'use client'
import { useEffect, useState } from 'react'

interface PlantDetails {
  name: string
  description: string
  common_names: string[]
  synonyms: string[]
  taxonomy: {
    kingdom: string
    phylum: string
    class: string
    order: string
    family: string
    genus: string
  }
  image: string
  url: string
  edible_parts: string[]
  gbif_id: number
  inaturalist_id: number
  rank: string
  probability: number
}

const Page = () => {
  const [detailData, setDetailData] = useState<PlantDetails | null>(null)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const data = searchParams.get('data')

    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data))
        setDetailData({
          name: parsedData.name || 'Unknown Plant',
          description: parsedData.details?.description?.value || 'No description.',
          common_names: parsedData.details?.common_names || [],
          synonyms: parsedData.details?.synonyms || [],
          taxonomy: parsedData.details?.taxonomy || {},
          image: parsedData.details?.image?.value || '',
          url: parsedData.details?.url || '',
          edible_parts: parsedData.details?.edible_parts || [],
          gbif_id: parsedData.details?.gbif_id || 0,
          inaturalist_id: parsedData.details?.inaturalist_id || 0,
          rank: parsedData.details?.rank || '',
          probability: parsedData.probability || 0,
        })
      } catch (e) {
        console.error('Error parsing data:', e)
      }
    }
  }, [])

  if (!detailData) {
    return <p>Loading...</p>
  }

  return (
    <div className='min-h-screen p-6 bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Plant Details</h1>
      <div className='p-4 bg-white rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold'>{detailData.name}</h2>
        <p className='text-gray-600 mt-2'>
          <strong>Description:</strong> {detailData.description}
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>Common Names:</strong>{' '}
          {detailData.common_names.join(', ') || 'N/A'}
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>Synonyms:</strong> {detailData.synonyms.join(', ') || 'N/A'}
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>Edible Parts:</strong> {detailData.edible_parts.join(', ') || 'N/A'}
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>Probability:</strong> {(detailData.probability * 100).toFixed(2)}%
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>Rank:</strong> {detailData.rank}
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>GBIF ID:</strong> {detailData.gbif_id}
        </p>
        <p className='text-gray-600 mt-2'>
          <strong>iNaturalist ID:</strong> {detailData.inaturalist_id}
        </p>
        <p className='text-gray-600 mt-4'>
          <strong>Taxonomy:</strong>
        </p>
        <ul className='ml-4 text-gray-600'>
          <li>Kingdom: {detailData.taxonomy.kingdom || 'N/A'}</li>
          <li>Phylum: {detailData.taxonomy.phylum || 'N/A'}</li>
          <li>Class: {detailData.taxonomy.class || 'N/A'}</li>
          <li>Order: {detailData.taxonomy.order || 'N/A'}</li>
          <li>Family: {detailData.taxonomy.family || 'N/A'}</li>
          <li>Genus: {detailData.taxonomy.genus || 'N/A'}</li>
        </ul>
        {detailData.image && (
          <div className='mt-4'>
            <img
              src={detailData.image}
              alt={detailData.name}
              className='max-w-full h-auto rounded-md shadow-md'
            />
          </div>
        )}
        <p className='text-gray-600 mt-4'>
          <strong>More Info:</strong>{' '}
          <a
            href={detailData.url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline'
          >
            {detailData.url}
          </a>
        </p>
      </div>
    </div>
  )
}

export default Page
