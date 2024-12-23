'use client'

import Script from 'next/script'
import PricingContent from './pricing-content'
import { useState } from 'react'
import Navbar from '@/app/components/navbar/Navbar'

export default function ClientWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  return (
    <>
      <Navbar toggle={toggleMenu} />
      <PricingContent />
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
} 