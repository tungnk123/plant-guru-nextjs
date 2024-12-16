'use client'
import { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Navbar from '../components/navbar/Navbar'
import Image from 'next/image'

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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!detailData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">No data found.</p>
      </div>
    );
  }

  const toggleMenu = () => {

  };


  return (
    <section className="w-full bg-white py-10">
      <div className="full-w mx-10 bg-white overflow-hidden">
        <div className="relative flex flex-col md:flex-row">
          <div className="p-8 md:w-2/3">
            <h1 className="text-5xl font-bold text-black">
              {detailData.common_names && detailData.common_names.length > 0
                ? detailData.common_names[0]
                : detailData.name}
            </h1>

            <div className="flex flex-row mt-7">
              <div className="flex flex-col">
                <p className="text-gray-800 font-semibold">Common Names</p>
                {detailData.common_names && detailData.common_names.length > 0 ? (
                  <ul className="text-sm text-[#685F5F] list-disc list-inside">
                    {detailData.common_names.slice(0, 3).map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#685F5F]">N/A</p>
                )}
              </div>

              <div className="flex flex-col ms-48">
                <p className="text-gray-800 font-semibold">Synonyms</p>
                {detailData.synonyms && detailData.synonyms.length > 0 ? (
                  <ul className="text-sm text-[#685F5F] list-disc list-inside">
                    {detailData.synonyms.slice(0, 3).map((synonym, index) => (
                      <li key={index}>{synonym}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#685F5F]">N/A</p>
                )}
              </div>
            </div>

            <p className="mt-5 text-base font-normal text-black">
              {detailData.description || "This plant is known for its various uses."}
            </p>

            <div className="mt-36">
              <h2 className="text-3xl font-medium text-black">Scientific Classification</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_lifespan.svg"
                    alt="Lifespan Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Lifespan</p>
                    <p className="text-sm text-[#685F5F]">{detailData.lifespan || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_plant_type.svg"
                    alt="Planttype Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Plant Type</p>
                    <p className="text-sm text-[#685F5F]">{detailData.plant_type || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_bloom_time.svg"
                    alt="Bloomtime Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Bloom Time</p>
                    <p className="text-sm text-[#685F5F]">{detailData.bloom_time || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_leaf_color.svg"
                    alt="FlowerColor Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Leaf Color</p>
                    <p className="text-sm text-[#685F5F]">{detailData.leaf_color || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_flower_color.svg"
                    alt="FlowerColor Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Flower Color</p>
                    <p className="text-sm text-[#685F5F]">{detailData.flower_color || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_plant_type.svg"
                    alt="Edible Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Edible Part</p>
                    {detailData.edible_parts && detailData.edible_parts.length > 0 ? (
                      <ul className="text-sm text-[#685F5F] list-disc list-inside">
                        {detailData.edible_parts.map((part, index) => (
                          <li key={index}>{part}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#685F5F]">N/A</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Image
                    src="/images/img_plant_detail_ideal_temp.svg"
                    alt="FlowerColor Icon"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-800 font-semibold">Ideal Temperature</p>
                    <p className="text-sm text-[#685F5F]">{detailData.ideal_temperature || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700">Care Guide</h2>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <span className="material-icons text-yellow-500">wb_sunny</span>
                  <p className="text-gray-600">Sunlight: Full Sun</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="material-icons text-green-500">yard</span>
                  <p className="text-gray-600">Soil: Garden Soil</p>
                </div>
              </div>
            </div> */}
          </div>

          <div className="absolute top-0 right-0 md:w-1/3 p-4">
            <Image
              src={detailData.image ?? "/images/img_identify_plant.svg"}
              alt={detailData.name}
              className="w-full h-auto rounded-lg shadow-md"
              width={319}
              height={319}
            />
          </div>
        </div>
      </div>
    </section>

  );
};

export default Page
