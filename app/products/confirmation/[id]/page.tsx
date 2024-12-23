'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, ProductData } from '@/app/api/productService';
import BreadcrumbNavigation from '@/app/components/navbar/BreadcrumbNavigation';
import Navbar from '@/app/components/navbar/Navbar';

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

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleConfirmPurchase = () => {
    // Handle purchase confirmation logic here
    console.log('Purchase confirmed:', { product, quantity, shippingAddress });
    // Redirect or show a success message
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar toggle={() => {}} />
      <BreadcrumbNavigation productName={product.productName} />
      <div className="container mx-auto p-10">
        <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:w-1/2">
            <div className="w-full max-w-md h-96 flex items-center justify-center overflow-hidden rounded-lg shadow-xl">
              <img
                className="object-cover w-full h-full"
                src={product.productImages[currentImageIndex]}
                alt={product.productName}
              />
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
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold">{product.productName}</h2>
            <p className="text-lg text-gray-700 mt-2">{product.description}</p>
            <p className="text-xl text-orange-500 font-semibold mt-2">${product.price}</p>
            <div className="mb-4 mt-6">
              <label className="block font-semibold mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Shipping Address</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter your shipping address"
              />
            </div>
            <p className="text-lg font-semibold">Total Price: ${totalPrice}</p>
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