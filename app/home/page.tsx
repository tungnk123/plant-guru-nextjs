"use client";
import Navbar from '@/app/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {HeroSection} from '@/app/home/components/HeroSection';
import PostSection from '@/app/home/components/PostSection';

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="w-full">
      <section className="w-full">
        <Navbar toggle={toggleMenu} />
        <HeroSection />
        <PostSection /> 
      </section>
    </div>
  );
};

export default Page;
