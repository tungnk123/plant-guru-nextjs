"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts, ProductData } from '@/app/api/productService';

const Products = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-500 transition-all duration-200 cursor-pointer">
            <img
              className="w-full h-48 object-cover"
              src={product.productImages[0] || '/placeholder.png'}
              alt={product.productName}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
              <p className="text-orange-500 font-medium">${product.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Products; 