import Head from 'next/head'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import CategoryCards, { CategoryCardsProps } from '@/app/home/components/CategoryCards'

export const HeroSection: React.FC<CategoryCardsProps> = ({ onTagChange }) => {
  const stats = { plants: 10, posts: 10, users: 10 }

  return (
    <div>
      <Head>
        <title>Plant GURU</title>
      </Head>

      <div className="container mx-auto flex flex-col items-center space-y-4 rounded-3xl py-6">
        <header className='w-full heroSection header flex flex-col items-center space-y-4 text-center rounded-3xl shadowBottomEnd'>
          <div className='flex flex-row items-center space-x-2'>
            <Image src='/images/ic_logo.svg' alt='Logo' width={48} height={48} />
            <h1 className='inter-medium text-5xl'>Plant GURU</h1>
          </div>
          <p className='inter-medium text-2xl'>Your Ultimate Plant Companion</p>
          <Input
            type='text'
            placeholder='Search for a plant or ask a question...'
            className='w-full rounded-md border border-gray-300 bg-white p-2'
          />
        </header>

        <section className='stats  flex justify-start space-x-8 text-lg text-gray-700 w-full px-6'>
          <div className='flex flex-row items-center mt-2'>
            <Image
              src='/images/ic_plant_status.svg'
              alt='Logo'
              width={32}
              height={32}
            />
            <p className='inter-bold mx-1 mt-1'>{stats.plants}</p> plants
          </div>
          <div className='flex flex-row items-center mt-2'>
            <Image
              src='/images/ic_post_status.svg'
              alt='Logo'
              width={32}
              height={32}
            />
            <p className='inter-bold mx-1 mt-1'>{stats.posts}</p> posts
          </div>
          <div className='flex flex-row items-center mt-2'>
            <Image
              src='/images/ic_user_status.svg'
              alt='Logo'
              width={32}
              height={32}
            />
            <p className='inter-bold mx-1 mt-1'>{stats.users}</p> users
          </div>
        </section>
      </div>

      <CategoryCards onTagChange={onTagChange}/>
    </div>
  )
}
