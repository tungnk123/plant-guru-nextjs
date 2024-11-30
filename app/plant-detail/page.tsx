'use client'
import { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
  image?: string
  url: string
  edible_parts: string[]
  gbif_id: number
  inaturalist_id: number
  rank: string
  probability: number
  lifespan?: string
  bloom_time?: string
  flower_color?: string
  ideal_temperature?: string
  plant_type?: string
  leaf_color?: string
}

const Page = () => {
  const [detailData, setDetailData] = useState<PlantDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const randomValue = (choices: string[]) =>
    choices[Math.floor(Math.random() * choices.length)]

  const parseGeneratedDetails = (text: string) => {
    const lines = text.split('\n')
    const details: Partial<PlantDetails> = {}

    lines.forEach(line => {
      if (line.startsWith('Lifespan:')) {
        details.lifespan = line.replace('Lifespan:', '').trim()
      } else if (line.startsWith('Bloom Time:')) {
        details.bloom_time = line.replace('Bloom Time:', '').trim()
      } else if (line.startsWith('Flower Color:')) {
        details.flower_color = line.replace('Flower Color:', '').trim()
      } else if (line.startsWith('Leaf Color:')) {
        details.leaf_color = line.replace('Leaf Color:', '').trim()
      } else if (line.startsWith('Plant Type:')) {
        details.plant_type = line.replace('Plant Type:', '').trim()
      } else if (line.startsWith('Ideal Temperature:')) {
        details.ideal_temperature = line
          .replace('Ideal Temperature:', '')
          .trim()
      }
    })

  
    details.bloom_time = randomValue(['Spring', 'Summer', 'Fall', 'Winter'])

    details.flower_color =
      details.flower_color === 'Information not available in text' ||
      details.bloom_time === 'Not specified' ||
      !details.flower_color
        ? randomValue(['Red', 'Yellow', 'Pink', 'White', 'Orange', 'Blue'])
        : details.flower_color

    details.ideal_temperature = randomValue(['15-20°C', '20-25°C', '25-30°C'])

    return details
  }

  const generatePlantDetails = async (description: string) => {
    try {
      const genAI = new GoogleGenerativeAI(
        'AIzaSyCYhMw5ThRkupqH9iON1RCKbnvMCks7nSA'
      )
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `
        The description of the plant is: "${description}". 
        Based on this description, infer the following details and provide them as plain text in the following format:

        Example:
        Lifespan: Perennial
        Bloom Time: Spring and Summer
        Flower Color: Pink, White
        Leaf Color: Green
        Plant Type: Herb
        Ideal Temperature: 18-25°C

        Now generate the details based on the given plant description:
      `

      const result = await model.generateContent(prompt)

      const output = result.response.text() 
      return output 
    } catch (error) {
      console.error('Error generating plant details:', error)
      return ''
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const data = searchParams.get('data')

    if (data) {
      try {
        const decodedData = decodeURIComponent(decodeURIComponent(data))
        const parsedData = JSON.parse(decodedData)

        generatePlantDetails(parsedData.description).then(generatedDetails => {
          const parsedDetails = parseGeneratedDetails(generatedDetails)

          setDetailData({
            ...parsedData,
            ...parsedDetails
          })
          setIsLoading(false)
        })
      } catch (error) {
        console.error('Error parsing data:', error)
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <p className='text-gray-600'>Loading...</p>
      </div>
    )
  }

  if (!detailData) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <p className='text-gray-600'>No data found.</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='mb-4 text-2xl font-bold'>Plant Details</h1>
      <div className='rounded-lg bg-white p-4 shadow-md'>
        <h2 className='text-xl font-semibold'>{detailData.name}</h2>
        <p className='mt-2 text-gray-600'>
          <strong>Description:</strong> {detailData.description}
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>Common Names:</strong>{' '}
          {detailData.common_names.join(', ') || 'N/A'}
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>Synonyms:</strong> {detailData.synonyms.join(', ') || 'N/A'}
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>Edible Parts:</strong>{' '}
          {detailData.edible_parts.join(', ') || 'N/A'}
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>Probability:</strong>{' '}
          {(detailData.probability * 100).toFixed(2)}%
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>Rank:</strong> {detailData.rank}
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>GBIF ID:</strong> {detailData.gbif_id}
        </p>
        <p className='mt-2 text-gray-600'>
          <strong>iNaturalist ID:</strong> {detailData.inaturalist_id}
        </p>
        <div className='mt-6'>
          <h3 className='text-lg font-semibold'>Scientific Classification</h3>
          <div className='mt-4 grid grid-cols-2 gap-4 text-gray-600'>
            <div>
              <p>
                <strong>Lifespan:</strong> {detailData.lifespan || 'N/A'}
              </p>
            </div>
            <div>
              <p>
                <strong>Plant Type:</strong> {detailData.plant_type || 'N/A'}
              </p>
            </div>
            <div>
              <p>
                <strong>Bloom Time:</strong> {detailData.bloom_time || 'N/A'}
              </p>
            </div>
            <div>
              <p>
                <strong>Leaf Color:</strong> {detailData.leaf_color || 'N/A'}
              </p>
            </div>
            <div>
              <p>
                <strong>Flower Color:</strong>{' '}
                {detailData.flower_color || 'N/A'}
              </p>
            </div>
            <div>
              <p>
                <strong>Ideal Temperature:</strong>{' '}
                {detailData.ideal_temperature || 'N/A'}
              </p>
            </div>
          </div>
        </div>
        {detailData.image && (
          <div className='mt-4'>
            <img
              src={detailData.image}
              alt={detailData.name}
              className='h-auto max-w-full rounded-md shadow-md'
            />
          </div>
        )}
        <p className='mt-4 text-gray-600'>
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
