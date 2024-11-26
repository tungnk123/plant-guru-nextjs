import Image from 'next/image'

const categories = [
  { id: 1, name: 'Plants', icon: "/images/img_category_plant_icon.svg", color: 'bg-yellow-500' },
  { id: 2, name: 'Sale & Trade', icon: "/images/img_category_sale_trade_icon.svg", color: 'bg-yellow-300' },
  { id: 3, name: 'Guides & Tips', icon: "/images/img_category_guide_tips_icon.svg", color: 'bg-red-500' },
  { id: 4, name: 'Q&A', icon: "/images/img_category_qa_icon.svg", color: 'bg-purple-500' }
]

const CategoryCards = () => {
  return (
    <div className="bg-[#508D4E] py-10">
      <div className="container mx-auto text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">CATEGORIES</h2>
        <div className="mx-auto grid max-w-md grid-cols-2 gap-1 md:grid-cols-4 md:max-w-screen-lg ">
          {categories.map(category => (
            <div className="relative w-full max-w-[150px] mx-auto">
              <Image
                src={category.icon}
                alt={category.name}
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />

              <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center bg-transparent rounded-lg">
                <p className="text-center text-[#1A5319] text-lg font-medium">{category.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryCards
