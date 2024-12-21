"use client";
import Script from 'next/script';
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
      <Script src="https://www.paypal.com/sdk/js?client-id=ATJyj8meUqzHFrva5GOxam0zkx6Nuk073MWVqeRt9jHEGc1rR7He8yLTL8jr2Y5VVsVGwZPPG_axY6yb" />
    </div>
  );
}

export default Page;
