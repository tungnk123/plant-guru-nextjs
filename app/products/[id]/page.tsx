'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductById, ProductData } from '@/app/api/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          console.log(data);
          setProduct(data);
        } catch (error) {
          console.error('Failed to load product:', error);
        }
      };

      loadProduct();
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{product.productName}</h1>
      <img
        className="w-full h-64 object-cover"
        src={product.productImages[0] || '/placeholder.png'}
        alt={product.productName}
      />
      <p className="text-lg text-gray-700">{product.description}</p>
      <p className="text-orange-500 font-medium">${product.price}</p>
    </div>
  );
};

export default ProductDetail; 