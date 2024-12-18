import Image from 'next/image'
import { useState } from 'react';

// components/CategoryCards.js
const categories = [
  {
    id: 1,
    name: 'All Categories',
    icon: "/images/ic_category_all.svg",
    color: 'bg-[#00FF9C]'
  },
  { id: 2, name: 'Plants', icon: "/images/ic_category_plant.svg", color: 'bg-[#00FF9C]' },
  { id: 3, name: 'Flowers', icon: "/images/ic_category_flower.svg", color: 'bg-[#00FF9C]' },
  { id: 4, name: 'Guides & Tips', icon: "/images/ic_category_guide.svg", color: 'bg-[#00FF9C]' },
  { id: 5, name: 'Diseases', icon: "/images/ic_category_disease.svg", color: 'bg-[#00FF9C]' },
  { id: 6, name: 'Q&A', icon: "/images/ic_category_qa.svg", color: 'bg-[#00FF9C]' },
]

export interface CategoryCardsProps {
  onTagChange: (tag: string) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ onTagChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1);

  const handleCardClick = (id: number, name: string) => {
    setSelectedCategory(id);
    onTagChange(name);
  };
  return (
    <div className='w-1/6 container mx-auto my-1'>
      <h2 className='mb-4 text-2xl font-bold '>Top Categories</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-1'>
        {categories.map(category => (
          <div
            key={category.id}
            className='group cursor-pointer flex items-center rounded-lg border border-gray-300 bg-gray-100 shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg'
            onClick={() => handleCardClick(category.id, category.name)}
          >
            <div className={` ${
              selectedCategory === category.id ? 'bg-green-500' : category.color
            } h-full w-5 rounded-l-lg`} />

            <div className='flex w-full items-center p-2'>
              <Image
                src={category.icon}
                alt='Logo'
                width='48'
                height='48'
                className='mr-3 text-2xl'
              />
              <span className='text-lg font-medium flex-grow text-center -ml-12'>{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryCards
