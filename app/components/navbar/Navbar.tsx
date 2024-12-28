'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import PrimaryButton from '@/app/components/PrimaryButton'
import { Plus, MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { fetchUserById, User } from '@/app/admin/api/user'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  toggle?: () => void;
}

export default function Navbar({ toggle }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserById(userId).then(setUser).catch(console.error);
    }
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      // Navigate to user profile or settings
      router.push('/profile');
    } else {
      // Navigate to login page
      router.push('/login');
    }
  };

  const handleCreateProductClick = () => {
    if (user && !user.isHavePremium) {
        toast({
            title: "Unlock Premium Features!",
            description: (
                <div>
                    <p>You need a premium account to create a product.</p>
                    <p className="mt-2">Enjoy exclusive benefits and boost your sales!</p>
                    <Link href="/pricing">
                        <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full 
                            hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                            font-medium text-sm shadow-md hover:shadow-lg">
                            Upgrade Now
                        </Button>
                    </Link>
                </div>
            ),
            variant: "destructive",
            duration: 8000, // Keep the toast visible for a longer duration
        });
    } else {
        router.push('/create-product');
    }
  };

  const handleChatIconClick = () => {
    router.push('/chat');
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
            <Link href='/group' className='inter-medium text-1xl'>
              <p>Group</p>
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
          {user && (pathname === '/home' || pathname === '/') && (
            <Link href="/create-post" className='inter-medium text-1xl'>
              <PrimaryButton text="Create Post" icon={<Plus />} />
            </Link>
          )}
          {user && pathname.startsWith('/products') && (
            <button onClick={handleCreateProductClick} className='inter-medium text-1xl'>
              <PrimaryButton text="Create New Product" icon={<Plus />} />
            </button>
          )}

          {user ? (
            <button onClick={handleUserIconClick} className="flex items-center space-x-2">
              <img
                src={user.avatar || '/images/ic_user.svg'}
                alt='User Avatar'
                className='h-8 w-8 rounded-full'
              />
              <span className="text-sm font-medium">{user.name}</span>
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

          <button onClick={handleChatIconClick} className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  )
}
