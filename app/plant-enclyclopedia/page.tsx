"use client";
import Navbar from '@/app/components/navbar/Navbar'
import { useState } from 'react'

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }
  return (
    <div className='w-full'>
      <section className='w-full'>
        <Navbar toggle={toggleMenu} />
        <p>Enclyclopedia</p>
      </section>
    </div>
  )
}

export default Page;
