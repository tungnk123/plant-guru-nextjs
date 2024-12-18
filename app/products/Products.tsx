import React from 'react';

const Products = () => {
  // Sample product data
  const products = [
    { id: 1, name: 'Product 1', price: '$10', imageUrl: '/images/product1.jpg' },
    { id: 2, name: 'Product 2', price: '$20', imageUrl: '/images/product2.jpg' },
    // Add more products as needed
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-700">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 