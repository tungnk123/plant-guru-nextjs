"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts, ProductData } from '@/app/api/productService';

const Products = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filterAndSortProducts = () => {
        let filtered = [...products];

        if (searchQuery) {
          filtered = filtered.filter(product =>
            product.productName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (priceRange !== 'all') {
          filtered = filtered.filter(product => {
            if (priceRange === 'low') return product.price < 50;
            if (priceRange === 'medium') return product.price >= 50 && product.price <= 100;
            if (priceRange === 'high') return product.price > 100;
            return true;
          });
        }

        if (sortOrder === 'priceAsc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'priceDesc') {
          filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
      };

      filterAndSortProducts();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, priceRange, sortOrder, products]);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/2 mb-4 md:mb-0"
        />
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/4 mb-4 md:mb-0 md:ml-4"
        >
          <option value="all">All Prices</option>
          <option value="low">Below $50</option>
          <option value="medium">$50 - $100</option>
          <option value="high">Above $100</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/4 md:ml-4"
        >
          <option value="default">Sort by default</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
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
    </div>
  );
};

export default Products; 