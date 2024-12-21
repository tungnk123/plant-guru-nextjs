"use client";
import Navbar from '@/app/components/navbar/Navbar';
import { useState } from 'react';
import PricingContent from './_components/pricing-content';

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div className='w-full'>
      <Navbar toggle={toggleMenu} />
      <section className='w-full'>
        <PricingContent />
      </section>
    </div>
  );
}

export default Page;
