import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const CreatePost = () => {
  const [backgroundColor, setBackgroundColor] = useState('#FFFF00')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Post submitted!')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))

      // Append new files to existing ones
      setSelectedImages(prevImages => [...prevImages, ...newFiles])
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages]
    const newPreviews = [...imagePreviews]
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setSelectedImages(newImages)
    setImagePreviews(newPreviews)
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-center text-2xl font-bold'>Create post</h1>
      <p className='mb-8 text-center text-gray-600'>
        Create a plant post and share it with the community
      </p>

      <div className='grid grid-cols-3 gap-8'>
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle>Create Your Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='mb-2 block font-semibold'>Title</label>
                <Input type='text' placeholder='Title' />
              </div>

              <div>
                <label className='mb-2 block font-semibold'>Description</label>
                <Textarea placeholder='Describe your plant...' />
              </div>

              <div>
                <label className='mb-2 block font-semibold'>Plant Images</label>
                <div className='mb-4 flex space-x-4'>
                  
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className='relative'>
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className='h-auto w-[300px] rounded object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white'
                      >
                        ✖
                      </button>
                    </div>
                  ))}

                  <div
                    className='flex h-[300px] w-[300px] cursor-pointer items-center justify-center rounded border border-dashed p-4'
                    onClick={() =>
                      document.getElementById('imageUpload')?.click()
                    }
                  >
                    <PlusIcon className='text-gray-500' />
                  </div>
                </div>
                <Input
                  id='imageUpload'
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <label className='mb-2 block font-semibold'>Tags</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>All Categories</SelectItem>
                    <SelectItem value='plants'>Plants</SelectItem>
                    <SelectItem value='flowers'>Flowers</SelectItem>
                    <SelectItem value='sell-trade'>Sell & Trade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block font-semibold'>Background</label>
                <Input
                  type='color'
                  value={backgroundColor}
                  onChange={e => setBackgroundColor(e.target.value)}
                  className='h-8 w-full p-1'
                />
              </div>

              <Button type='submit' className='w-full'>
                Post
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Still need help?</CardTitle>
            </CardHeader>
            <CardContent className='text-center'>
              <p className='mb-4 text-sm'>
                Create a plant post and share it with the community.
              </p>
              <Link href='/community'>
                <Button variant='outline'>Ask Community</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex items-center rounded bg-gray-100 p-2'>
                  <span>🌍</span>
                  <span className='ml-2'>All Categories</span>
                </div>
                <div className='flex items-center rounded bg-green-100 p-2'>
                  <span>🌱</span>
                  <span className='ml-2'>Plants</span>
                </div>
                <div className='flex items-center rounded bg-yellow-100 p-2'>
                  <span>🌸</span>
                  <span className='ml-2'>Flowers</span>
                </div>
                <div className='flex items-center rounded bg-red-100 p-2'>
                  <span>💰</span>
                  <span className='ml-2'>Sell & Trade</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
