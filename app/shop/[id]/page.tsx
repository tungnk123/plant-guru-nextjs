'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchUserById, User } from '@/app/admin/api/user';
import { fetchProductsByUser, ProductData } from '@/app/api/productService';
import Navbar from '@/app/components/navbar/Navbar';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';

const ShopPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);

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
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
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
    </div>
  );
};

export default ShopPage; 