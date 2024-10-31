import { Button } from '@/components/ui/button'
import React from 'react'
import { Plus } from "lucide-react"

const PrimaryButton = () => {
  return (
    <Button className='bg-yellow-300 hover:bg-yellow-600 text-black'>
    <Plus /> Create post
  </Button>
  )
}

export default PrimaryButton
