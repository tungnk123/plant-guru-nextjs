"use client"
import React, { useState } from 'react';
import Navbar from '@/app/components/navbar/Navbar';
import Products from '@/app/products/Products';

const ProductsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div>
      <Navbar toggle={toggleMenu} />
      <Products />
    </div>
  );
};

export default ProductsPage; 