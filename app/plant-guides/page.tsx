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
      <Navbar toggle={toggleMenu} />
      <section className='w-full'>
        <p>Plant guides</p>
      </section>
    </div>
  )
}

export default Page;
