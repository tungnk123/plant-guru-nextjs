import Image from 'next/image'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

// components/CategoryCards.js
const categories = [
  {
    id: 1,
    name: 'All Categories',
    icon: "/images/ic_category_all.svg",
    gradient: 'from-emerald-500 via-green-500 to-teal-500',
    bgGradient: 'from-emerald-100 via-green-100 to-teal-100'
  },
  {
    id: 2,
    name: 'Plants',
    icon: "/images/ic_category_plant.svg",
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-100 via-emerald-100 to-teal-100'
  },
  {
    id: 3,
    name: 'Flowers',
    icon: "/images/ic_category_flower.svg",
    gradient: 'from-rose-500 via-pink-500 to-emerald-500',
    bgGradient: 'from-rose-100 via-pink-100 to-emerald-100'
  },
  {
    id: 4,
    name: 'Guides & Tips',
    icon: "/images/ic_category_guide.svg",
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    bgGradient: 'from-blue-100 via-cyan-100 to-teal-100'
  },
  {
    id: 5,
    name: 'Diseases',
    icon: "/images/ic_category_disease.svg",
    gradient: 'from-amber-500 via-yellow-500 to-emerald-500',
    bgGradient: 'from-amber-100 via-yellow-100 to-emerald-100'
  },
  {
    id: 6,
    name: 'Q&A',
    icon: "/images/ic_category_qa.svg",
    gradient: 'from-violet-500 via-purple-500 to-emerald-500',
    bgGradient: 'from-violet-100 via-purple-100 to-emerald-100'
  },
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
    <div className='w-1/6 container mx-auto my-1 space-y-6'>
      <div className="relative p-2">
        <h2 className='text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent'>
          Top Categories
        </h2>
        <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full" />
      </div>

      <div className='grid grid-cols-1 gap-3'>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`relative cursor-pointer overflow-hidden border-none
                ${selectedCategory === category.id 
                  ? 'shadow-lg shadow-green-200/50' 
                  : 'shadow-md hover:shadow-lg'} 
                transform transition-all duration-300 hover:scale-[1.02]`}
              onClick={() => handleCardClick(category.id, category.name)}
            >
              {/* Permanent Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${
                selectedCategory === category.id 
                  ? category.gradient 
                  : category.bgGradient
              } opacity-${selectedCategory === category.id ? '20' : '50'}`} />
              
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

              {/* Content */}
              <div className='relative flex items-center p-3 gap-3'>
                {/* Icon Container with Permanent Gradient */}
                <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${category.gradient} 
                  p-0.5 transform transition-transform duration-300`}>
                  <div className="absolute inset-0 rounded-full bg-white/60 backdrop-blur-sm" />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Category Name with Permanent Gradient */}
                <span className={`text-sm font-medium flex-grow bg-gradient-to-r 
                  ${selectedCategory === category.id ? category.gradient : 'from-gray-700 to-gray-600'} 
                  bg-clip-text text-transparent transition-colors duration-300`}>
                  {category.name}
                </span>
              </div>

              {/* Active Indicator */}
              <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${category.gradient} 
                transform origin-top transition-transform duration-300 rounded-r-full
                ${selectedCategory === category.id ? 'scale-y-100' : 'scale-y-0'}`} />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
