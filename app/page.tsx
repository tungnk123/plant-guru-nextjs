"use client";
import Navbar from '@/app/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <div>
      <section className="">
        <div className="container">
          <Navbar toggle={toggleMenu} />
          <Button onClick={toggleMenu} className="mt-4">Toggle Menu</Button>
        </div>
      </section>
    </div>
  );
};

export default Page;
