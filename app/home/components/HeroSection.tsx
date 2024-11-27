import Head from 'next/head'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Search } from 'lucide-react'
import CategoryCards from '@/app/components/CategoryCards'

export default function HeroSection() {
  const stats = { plants: 10, posts: 10, users: 10 }

  return (
    <div>
      <Head>
        <title>Plant GURU</title>
      </Head>

      <div className="w-full flex flex-col items-center">
        <header
          className="relative w-full flex flex-col justify-center bg-[#e8f5e9] bg-[url('/images/img_hero_background.svg')]"
          style={{ height: '600px' }}
        >
          <div className="px-8 md:px-16 lg:px-24">
            <h1 className="inter-bold text-7xl text-[#1A5319]">PLANTGURU</h1>
            <p className="inter-medium text-5xl text-[#C0C0C0] mt-4">
              Your Ultimate Plant Companion
            </p>

            <div className="relative mt-6 w-full max-w-2xl">
              <Input
                type="text"
                placeholder="Search products..."
                className="mt-6 rounded-2xl border-gray-300 bg-white p-3 shadow-sm focus:outline-none focus:ring focus:ring-green-300 w-full max-w-2xl"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#508D4E] p-2 text-white shadow-md hover:bg-green-600"
              >
                <Search className="h-3 w-3" />
              </button>
            </div>
          </div>
        </header>
      </div>

      <CategoryCards />
    </div>
  )
}
