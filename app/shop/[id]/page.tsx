'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchUserById, User } from '@/app/admin/api/user';
import { fetchProductsByUser, ProductData } from '@/app/api/productService';
import Navbar from '@/app/components/navbar/Navbar';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';
import { useRouter } from 'next/navigation';
import { fetchUserExperience, getUserLevel } from '@/app/api/experienceService';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ShopPage = () => {

  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const currentUserId = localStorage.getItem('userId');
  const [userLevel, setUserLevel] = useState<{ level: number; nextLevelPoints: number | null }>({ level: 0, nextLevelPoints: null });
  const [experiencePoints, setExperiencePoints] = useState<number>(0)
  useEffect(() => {
    if (id) {
      const loadShopData = async () => {
        try {
          const userData = await fetchUserById(id as string);
          setUser(userData);
          const productsData = await fetchProductsByUser(id as string);
          setProducts(productsData);
        } catch (error) {
          console.error('Failed to load shop data:', error);
        }
      };

      loadShopData();
    }
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const startChat = async () => {
    const messageData = {
      userSendId: currentUserId,
      userReceiveId: user.userId,
      message: "Hello shop",
    };

    try {
      const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/chat/sendText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      router.push('/chat');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  return (
    <div>
      <Navbar toggle={() => {}} />
      <div className="container mx-auto p-10">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-4xl font-bold">Welcome to {user.name}'s Shop!</h1>
          <p className="mt-2">Discover exclusive deals and discounts on our products.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-6">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mr-4 border-2 border-gray-300" />
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            {currentUserId !== user.userId && (
              <button onClick={startChat} className="justify-center ml-10 mr-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z" />
                </svg>
                Chat
              </button>
            )}
          </div>
          <div className='mb-8 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-semibold text-gray-700'>
                        Level:{' '}
                        <span className='text-indigo-600'>
                          {userLevel.level}
                        </span>
                      </span>
                      {userLevel.nextLevelPoints && (
                        <span className='text-sm font-medium text-gray-500'>
                          {Math.floor(userLevel.nextLevelPoints) -
                            Math.floor(experiencePoints)}{' '}
                          points to next level
                        </span>
                      )}
                    </div>

                    <div className='relative h-6 w-96 rounded-full bg-gray-100 shadow-inner'>
                      <div
                        className='absolute h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow'
                        style={{
                          width: `${((experiencePoints / (userLevel.nextLevelPoints || 1)) * 100).toFixed(2)}%`
                        }}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className='absolute inset-0 cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-sm font-medium'>
                              {Math.floor(experiencePoints)} /{' '}
                              {userLevel.nextLevelPoints
                                ? Math.floor(userLevel.nextLevelPoints)
                                : 'N/A'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
        </div>
          <h2 className="text-2xl font-bold mb-4">Products by {user.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="relative block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-500 transition-all duration-200 cursor-pointer">
                  <img
                    className="w-full h-48 object-cover"
                    src={product.productImages[0] || '/placeholder.png'}
                    alt={product.productName}
                  />
                  {product.quantity === 0 && <OutOfStockBadge />}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
                    <p className="text-orange-500 font-medium">${product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ShopPage; 