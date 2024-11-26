'use client'
import React from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu'
import PrimaryButton from '@/app/components/PrimaryButton'
import { Plus } from 'lucide-react'

const Navbar = ({ toggle }: { toggle: () => void }) => {
    return (
    <div className='sticky top-0 z-50 h-20 w-full bg-white shadow-md'>
      <div className='container mx-auto flex h-full items-center justify-between px-8 md:px-20'>
        <div className='flex items-center gap-4'>
          <Logo />
          <button
            type='button'
            className='inline-flex items-center md:hidden'
            onClick={toggle}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <path
                fill='#000'
                d='M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z'
              />
            </svg>
          </button>
        </div>

        <ul className='hidden flex-1 items-center justify-center gap-x-8 text-black md:flex'>
          <li>
            <Link href='/home' className='text-lg font-medium hover:text-green-600'>
              Home
            </Link>
          </li>
          <li className='relative group'>
            <button className='text-lg font-medium hover:text-green-600'>
              Plant Encyclopedia
            </button>
            <div className='absolute left-0 hidden w-48 rounded-lg bg-white shadow-md group-hover:block'>
              <ul className='py-2'>
                <li>
                  <Link
                    href='/encyclopedia/plants'
                    className='block px-4 py-2 text-sm hover:bg-gray-100 hover:text-green-600'
                  >
                    Plants
                  </Link>
                </li>
                <li>
                  <Link
                    href='/encyclopedia/flowers'
                    className='block px-4 py-2 text-sm hover:bg-gray-100 hover:text-green-600'
                  >
                    Flowers
                  </Link>
                </li>
                <li>
                  <Link
                    href='/encyclopedia/trees'
                    className='block px-4 py-2 text-sm hover:bg-gray-100 hover:text-green-600'
                  >
                    Trees
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Link href='/identify-plant' className='text-lg font-medium hover:text-green-600'>
              Identify Plant
            </Link>
          </li>
          <li>
            <Link href='/plant-guides' className='text-lg font-medium hover:text-green-600'>
              Plant Guides
            </Link>
          </li>
        </ul>

        <div className='hidden items-center gap-4 md:flex'>
          <Link
            href='/login'
            className='text-sm font-medium text-gray-700 hover:text-green-600'
          >
            Login
          </Link>
          <Link
            href='/signup'
            className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
