'use client'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, fetchProductsByUser, ProductData } from '@/app/api/productService';
import { fetchUserById, User } from '@/app/admin/api/user';
import BreadcrumbNavigation from '@/app/components/navbar/BreadcrumbNavigation';
import Navbar from '@/app/components/navbar/Navbar';
import Link from 'next/link';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<ProductData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          setProduct(data);
          const userData = await fetchUserById(data.sellerId);
          setUser(userData);
          const productsData = await fetchProductsByUser(data.sellerId);
          setUserProducts(productsData);

          // Check if the description is long enough to require "See More"
          if (data.description.split(' ').length > 50) {
            setIsDescriptionLong(true);
          }
        } catch (error) {
          console.error('Failed to load product or user data:', error);
        }
      };

      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.productImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [product]);

  if (!product || !user) {
    return <div>Loading...</div>;
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleShopClick = () => {
    router.push(`/shop/${user.userId}`);
  };

  return (
    <div>
      <Head>
        <title>{product.productName}</title>
      </Head>
      <Navbar toggle={() => {}} />
      <BreadcrumbNavigation productName={product.productName} />
      <div className="container mx-auto p-10 bg-gradient-to-r from-gray-100 to-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex flex-col items-center md:w-1/2">
            <div className="w-full max-w-md h-96 flex items-center justify-center overflow-hidden rounded-lg shadow-xl relative">
              <img
                className="object-cover w-full h-full transition-transform transform hover:scale-105"
                src={product.productImages[currentImageIndex]}
                alt={product.productName}
              />
              {product.quantity === 0 && <OutOfStockBadge />}
            </div>
            <div className="flex mt-4 space-x-2 overflow-x-auto h-28">
              {product.productImages.map((image, index) => (
                <img
                  key={index}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform transform hover:scale-110 ${index === currentImageIndex ? 'border-2 border-orange-500' : ''}`}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.productName}</h1>
            <div
              className={`text-lg text-gray-600 mb-4 leading-relaxed overflow-hidden ${
                showFullDescription ? 'h-96 overflow-y-auto' : 'line-clamp-5'
              }`}
              style={{ maxHeight: '24rem' }}
            >
              {product.description}
            </div>
            {isDescriptionLong && !showFullDescription && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="text-blue-500 hover:underline"
              >
                See More
              </button>
            )}
            <p className="text-3xl text-orange-500 font-semibold mb-4">${product.price}</p>
            <p className="text-lg text-gray-700 mb-4">
              Stock: {product.quantity > 0 ? product.quantity : <span className="text-red-500">Out of Stock</span>}
            </p>
            {product.quantity === 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-4">
                Out of Stock
              </div>
            )}
            <button
              onClick={() => router.push(`/products/confirmation/${product.id}`)}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
              disabled={product.quantity === 0}
            >
              Buy Now
            </button>
          </div>
        </div>
        <div
          className="mt-10 p-4 bg-white rounded-lg shadow-md max-w-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={handleShopClick}
        >
          <h2 className="text-2xl font-bold mb-4">Shop</h2>
          <div className="flex items-center">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300" />
            <div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Other Products by {user.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userProducts.slice(0, 8).map((userProduct) => (
              <Link href={`/products/${userProduct.id}`} key={userProduct.id}>
                <div className="relative block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-500 transition-all duration-200 cursor-pointer">
                  <img
                    className="w-full h-48 object-cover"
                    src={userProduct.productImages[0] || '/placeholder.png'}
                    alt={userProduct.productName}
                  />
                  {userProduct.quantity === 0 && <OutOfStockBadge />}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{userProduct.productName}</h3>
                    <p className="text-orange-500 font-medium">${userProduct.price}</p>
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

export default ProductDetail; 