'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, ProductData } from '@/app/api/productService';
import BreadcrumbNavigation from '@/app/components/navbar/BreadcrumbNavigation';
import Navbar from '@/app/components/navbar/Navbar';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';

const ConfirmationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          setProduct(data);
          setTotalPrice(data.price);
        } catch (error) {
          console.error('Failed to load product:', error);
        }
      };

      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (product && value <= product.quantity) {
      setQuantity(value);
    } else if (product) {
      setQuantity(product.quantity);
    }
  };

  const handleConfirmPurchase = () => {
    // Handle purchase confirmation logic
    console.log('Purchase confirmed');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar toggle={() => {}} />
      <BreadcrumbNavigation productName={product.productName} />
      <div className="container mx-auto p-10 bg-gradient-to-r from-gray-100 to-white shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="flex flex-col items-center md:w-1/2">
            <div className="w-full max-w-md h-96 flex items-center justify-center overflow-hidden rounded-lg shadow-xl relative">
              <img
                className="object-cover w-full h-full transition-transform transform hover:scale-105"
                src={product.productImages.length > 0 ? product.productImages[0] : '/images/ic_logo.svg'}
                alt={product.productName}
              />
              {product.quantity === 0 && <OutOfStockBadge />}
            </div>
          </div>
          <div className="flex-1 md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.productName}</h1>
            <p className="text-lg text-gray-700 mb-4">Price: ${product.price.toFixed(2)}</p>
            <p className="text-lg text-gray-700 mb-4">Stock: {product.quantity}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full p-2 border rounded"
                min="1"
                max={product.quantity}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
              <input
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your shipping address"
              />
            </div>
            <p className="text-lg font-semibold">Total Price: ${totalPrice.toFixed(2)}</p>
            <button
              onClick={handleConfirmPurchase}
              className="mt-6 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage; 