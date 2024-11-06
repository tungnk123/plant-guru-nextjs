import Image from 'next/image'

// components/CategoryCards.js
const categories = [
  {
    id: 1,
    name: 'All Categories',
    icon: "/images/ic_category_all.svg",
    color: 'bg-green-500'
  },
  { id: 2, name: 'Plants', icon: "/images/ic_category_plant.svg", color: 'bg-yellow-500' },
  { id: 3, name: 'Flowers', icon: "/images/ic_category_flower.svg", color: 'bg-yellow-300' },
  { id: 4, name: 'Sell & Trade', icon: "/images/ic_category_sell.svg", color: 'bg-red-500' },
  { id: 5, name: 'Guides & Tips', icon: "/images/ic_category_guide.svg", color: 'bg-purple-500' },
  { id: 6, name: 'Diseases', icon: "/images/ic_category_disease.svg", color: 'bg-red-300' },
  { id: 7, name: 'Q&A', icon: "/images/ic_category_qa.svg", color: 'bg-orange-400' },
  { id: 8, name: 'DIY Projects', icon: "/images/ic_category_all.svg", color: 'bg-blue-500' }
]

const CategoryCards = () => {
  return (
    <div className='container mx-auto my-10'>
      <h2 className='mb-4 text-2xl font-bold'>Top Categories</h2>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {categories.map(category => (
          <div
            key={category.id}
            className='flex items-center rounded-lg border border-gray-300 bg-gray-100 shadow-md'
          >
            <div className={`${category.color} h-full w-5 rounded-l-lg`} />

            <div className='flex w-full items-center p-4'>
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
