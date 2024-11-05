import Head from 'next/head'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Search } from 'lucide-react'

export default function HeroSection() {
  const stats = { plants: 10, posts: 10, users: 10 }
  const categories = [
    { name: 'All Categories', color: 'green' },
    { name: 'Plants', color: 'yellow' },
    { name: 'Flowers', color: 'lightyellow' },
    { name: 'Sell & Trade', color: 'red' },
    { name: 'Guides & Tips', color: 'lightgreen' },
    { name: 'Diseases', color: 'pink' },
    { name: 'Q&A', color: 'lightblue' },
    { name: 'DIY Projects', color: 'blue' }
  ]

  return (
    <div>
      <Head>
        <title>Plant GURU</title>
      </Head>

      <header className='heroSection header container mx-auto mt-10 flex flex-col items-center space-y-4 rounded-3xl py-6 text-center shadow-lg'>
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

      <section className='stats mt-6 flex justify-center space-x-8 text-lg text-gray-700'>
        <div className='flex flex-row items-center justify-center'>
          <Image
            src='/images/ic_plant_status.svg'
            alt='Logo'
            width={32}
            height={32}
          />
          <p className='inter-bold mx-1 mt-1'>{stats.plants}</p> plants
        </div>
        <div className='flex flex-row items-center'>
          <Image
            src='/images/ic_post_status.svg'
            alt='Logo'
            width={32}
            height={32}
          />
           <p className='inter-bold mx-1 mt-1'>{stats.posts}</p> posts
        </div>
        <div className='flex flex-row items-center'>
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
  )
}
