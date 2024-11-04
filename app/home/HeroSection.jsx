import Head from 'next/head'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import Image from "next/image";
import { Search } from 'lucide-react';

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
        
      <header className="heroSection header container mx-auto flex flex-col items-center text-center space-y-4 py-6 mt-10 rounded-3xl shadow-lg">
        <div className="flex flex-row items-center space-x-2">
          <Image
            src="/images/ic_logo.svg"
            alt="Logo"
            width={48}  
            height={48}
          />
          <h1 className="inter-medium text-5xl">Plant GURU</h1>
        </div>
        <p className="inter-medium text-2xl ">
          Your Ultimate Plant Companion
        </p>
        <Input
          type="text"
          placeholder="Search for a plant or ask a question..."
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
        />
        
      </header>

      <section className="stats flex justify-center space-x-8 mt-6 text-lg text-gray-700">
        <div>{stats.plants} plants</div>
        <div>{stats.posts} posts</div>
        <div>{stats.users} users</div>
      </section>
    </div>
  )
}
