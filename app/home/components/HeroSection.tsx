import Head from 'next/head'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import CategoryCards, { CategoryCardsProps } from '@/app/home/components/CategoryCards'

export const HeroSection = () => {
  const stats = { plants: 10, posts: 10, users: 10 }

  return (
<div>
  <Head>
    <title>Plant GURU</title>
  </Head>

  <div className="container mx-auto flex flex-row items-start space-x-1 rounded-3xl py-1">
    <section className="stats flex flex-col justify-start text-lg text-gray-700 w-1/6 px-4">
      <div className="flex flex-row items-center">
        <Image
          src="/images/ic_plant_status.svg"
          alt="Plant Status Icon"
          width={32}
          height={32}
        />
        <p className="inter-bold mx-2">{stats.plants}</p> plants
      </div>
      <div className="flex flex-row items-center">
        <Image
          src="/images/ic_post_status.svg"
          alt="Post Status Icon"
          width={32}
          height={32}
        />
        <p className="inter-bold mx-2">{stats.posts}</p> posts
      </div>
      <div className="flex flex-row items-center">
        <Image
          src="/images/ic_user_status.svg"
          alt="User Status Icon"
          width={32}
          height={32}
        />
        <p className="inter-bold mx-2">{stats.users}</p> users
      </div>
    </section>

    <div className="w-5/6 flex flex-col items-center space-y-2 rounded-3xl">
      <header className="w-full h-36 heroSection header flex flex-row items-center space-y-2 text-center rounded-3xl shadowBottomEnd py-4 mb-4">
        <div className="flex flex-row items-center space-x-2 mr-16">
          <Image src="/images/ic_logo.svg" alt="Logo" width={48} height={48} />
          <h1 className="inter-medium text-xl">Plant GURU</h1>
        </div>
        {/* <p className="inter-medium text-lg">Your Ultimate Plant Companion</p> */}
        <Input
          type="text"
          placeholder="Search for a plant or ask a question..."
          className="w-full rounded-md border border-gray-300 bg-white p-2"
        />
      </header>
    </div>
  </div>
</div>

  )
}
