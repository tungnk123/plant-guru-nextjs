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
    <div className='sticky top-0 h-20 w-full z-50 bg-white shadow'>
      <div className='container mx-auto flex h-full items-center justify-between px-20'>
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

        <ul className='hidden flex-1 items-center justify-center gap-x-6 text-black md:flex'>
          <li>
            <Link href='/home' className='inter-medium text-1xl'>
              <p>Home</p>
            </Link>
          </li>
          <li>
            <NavigationMenu className='bg-transparent'>
              <NavigationMenuList className='bg-transparent'>
                <NavigationMenuItem className='bg-transparent'>
                  <NavigationMenuTrigger className='inter-medium text-1xl bg-transparent'>
                    Plant Encyclopedia
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='bg-transparent'>
                    <NavigationMenuLink className='bg-red-700'>
                      Link
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </li>
          <li>
            <Link href='/identify-plant' className='inter-medium text-1xl'>
              <p>Identify Plant</p>
            </Link>
          </li>
          <li>
            <Link href='/products' className='inter-medium text-1xl'>
              <p>Products</p>
            </Link>
          </li>
        </ul>

        <div className='hidden items-center gap-4 md:flex'>
          <Link href='/create-post' className='inter-medium text-1xl'>
            <PrimaryButton text='Create Post' icon={<Plus />} />
          </Link>

          <button>
            <img
              src='/images/ic_user.svg'
              alt='User Icon'
              className='h-8 w-8 rounded-full'
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
