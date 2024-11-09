import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../navbar/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-yellow1 text-black pt-14 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          <Link href="/" className="text-center font-bold hover:underline">Home</Link>
          <Link href="/plant-encyclopedia" className="text-center font-bold hover:underline">Plant Encyclopedia</Link>
          <Link href="/identify-plant" className="text-center font-bold hover:underline">Identify Plant</Link>
          <Link href="/plant-guide" className="text-center font-bold hover:underline">Plant Guide</Link>
        </div>

        <div className="flex flex-col items-center mb-6">
          <Logo />
        </div>

        <p className="flex flex-col items-center font-normal text-[16px] font-inter mb-6">© 2024 Plant Guru. All rights reserved. </p>

        <div className="flex justify-center space-x-8">
          <Link href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <Image className='h-5 w-3'
            src="/images/img_facebook_icon.svg" alt="Facebook" width={12} height={20} />
          </Link>
          <Link className='pt-1'
          href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <Image
            src="/images/img_twitter_icon.svg" alt="Twitter" width={12} height={20} />
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image className='pt-1'
            src="/images/img_insta_icon.svg" alt="Instagram" width={12} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;