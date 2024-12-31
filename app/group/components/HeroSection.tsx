import Head from 'next/head'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  return (
    <div className="  container mx-auto flex flex-row justify-center space-x-1 rounded-3xl py-1">
      <div className="w-5/6 flex flex-col items-center space-y-2 rounded-3xl">
        <header className="w-full h-36 heroSection header flex flex-row items-center space-y-2 text-center rounded-3xl shadowBottomEnd py-4 mb-4">
          <div className="flex flex-row items-center space-x-2 mr-16">
            <Image src="/images/ic_logo.svg" alt="Logo" width={48} height={48} />
            <h1 className="inter-medium text-xl">Plant GURU Group</h1>
          </div>
          <Input
            type="text"
            placeholder="Search for group by name....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2"
          />
        </header>
      </div>
    </div>
  )
}
