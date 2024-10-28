'use client';
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu';
import PrimaryButton from '@/app/components/PrimaryButton';

const Navbar = ({ toggle }: { toggle: () => void }) => {
  return (
    <div className='sticky top-0 h-20 w-full bg-emerald-800'>
      <div className='container mx-auto h-full px-4 flex items-center justify-center'>
        <div className='flex h-full w-full items-center justify-between'>
          <Logo />

          <button
            type='button'
            className='inline-flex items-center md:hidden'
            onClick={toggle}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
            >
              <path
                fill='#fff'
                d='M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z'
              />
            </svg>
          </button>

          <ul className='hidden gap-x-6 text-white md:flex items-center'>
            <li>
              <Link href='/pages'>
                <p>Home</p>
              </Link>
            </li>
            <li>
              <NavigationMenu className="bg-transparent">
                <NavigationMenuList className="bg-transparent">
                  <NavigationMenuItem className="bg-transparent">
                    <NavigationMenuTrigger className="bg-transparent">Plant Enclyclopedia</NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-transparent">
                      <NavigationMenuLink className="bg-red-700">Link</NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </li>
            <li>
              <Link href='/identify-plant'>
                <p>Identify plant</p>
              </Link>
            </li>
            <li>
              <Link href='/plant-guides'>
                <p>Plant Guides</p>
              </Link>
            </li>
            <li>
              <Link href='/storage'>
                <p>Storage</p>
              </Link>
            </li>
            <li>
              <Link href='/leaderboard'>
                <p>Leaderboard</p>
              </Link>
            </li>

            <li>
                <PrimaryButton/>
            </li>
          </ul>

          <div className='hidden md:block'>
            <Button />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
