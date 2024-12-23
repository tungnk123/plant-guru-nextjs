'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import PrimaryButton from '@/app/components/PrimaryButton'
import { Plus } from 'lucide-react'
import { usePathname } from 'next/navigation'


interface NavbarProps {
  toggle?: () => void;
}

export default function Navbar({ toggle }: NavbarProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

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
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className='inter-medium text-1xl'>
                    Plant Encyclopedia
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
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
          <li>
            <Link href='/pricing' className='inter-medium text-1xl'>
              <p>Pricing</p>
            </Link>
          </li>
        </ul>

        <div className='hidden items-center gap-4 md:flex'>
          <Link href={pathname.startsWith('/products') ? '/create-product' : '/create-post'} className='inter-medium text-1xl'>
            <PrimaryButton text={pathname.startsWith('/products') ? 'Create New Product' : 'Create Post'} icon={<Plus />} />
          </Link>

          {isLoggedIn ? (
            <button onClick={handleUserIconClick}>
              <img
                src='/images/ic_user.svg'
                alt='User Icon'
                className='h-8 w-8 rounded-full'
              />
            </button>
          ) : (
            <Button 
              onClick={handleUserIconClick}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-2 rounded-full 
                hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300
                font-medium text-sm shadow-md hover:shadow-lg"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
