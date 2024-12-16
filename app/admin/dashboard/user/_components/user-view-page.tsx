'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import PageContainer from '@/components-admin/layout/page-container'
import { useEffect, useState } from 'react'
import { fetchUserById, User } from '@/app/admin/api/user'
import { Button } from '@/components/ui/button'
import {
  Pencil,
  Trash2,
  Crown,
  Save,
  Mail,
  User as UserIcon,
  ImageIcon
} from 'lucide-react'
import Lottie from 'react-lottie-player'
import loadingAnimation from '@/public/animations/loading.json'
import { Input } from '@/components/ui/input'

export default function UserViewPage({
  params
}: {
  params: { userId: string }
}) {
  const { userId } = params
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)

  useEffect(() => {
    async function fetchUserDetails() {
      setLoading(true)
      setError(null)
      try {
        const userData = await fetchUserById(userId)
        setUser(userData)
        setEditedUser(userData)
      } catch (error) {
        console.error('Error fetching user details:', error)
        setError('Failed to fetch user details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId])

  const handleEditToggle = () => setIsEditing(!isEditing)

  const handleSave = () => {
    console.log('Updated User Data:', editedUser)
    setUser(editedUser) // Simulate save
    setIsEditing(false)
  }

  const handleChange = (field: keyof User, value: string | boolean) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value })
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className='flex h-screen flex-col items-center justify-center'>
          <Lottie
            loop
            animationData={loadingAnimation}
            play
            style={{ width: 150, height: 150 }}
          />
          <p className='mt-4 text-lg text-gray-500'>Loading user details...</p>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <p className='text-red-500'>{error}</p>
      </PageContainer>
    )
  }

  if (!user) {
    return (
      <PageContainer>
        <p>User not found</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className='flex justify-end space-x-2 p-4'>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2 border-yellow-500 text-yellow-500 hover:bg-yellow-100'
          onClick={() => console.log('Upgrade to Premium')}
        >
          <Crown className='h-4 w-4' />
          Upgrade to Premium
        </Button>

        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-100'
          onClick={handleEditToggle}
        >
          <Pencil className='h-4 w-4' />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>

        {isEditing && (
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-2 border-green-500 text-green-500 hover:bg-green-100'
            onClick={handleSave}
          >
            <Save className='h-4 w-4' />
            Save
          </Button>
        )}

        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-100'
          onClick={() => console.log('Delete User')}
        >
          <Trash2 className='h-4 w-4' />
          Delete User
        </Button>
      </div>

      <ScrollArea>
        <div className='space-y-6 rounded-md bg-white p-6 shadow-md'>
          <div className='text-center'>
            <div className='text-center'>
              <img
                src={user.avatar || '/images/ic_user.svg'}
                alt={`${user.name}'s avatar`}
                className='mx-auto mb-4 h-28 w-28 rounded-full border-4 border-gray-100 shadow-md'
                onError={e => {
                  ;(e.target as HTMLImageElement).src =
                    '/images/ic_user.svg' // Fallback to a default avatar
                }}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            {/* Name */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700'>
                <UserIcon className='mr-2 h-4 w-4 text-gray-500' />
                Name
              </label>
              <Input
                type='text'
                value={editedUser?.name || ''}
                disabled={!isEditing}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700'>
                <Mail className='mr-2 h-4 w-4 text-gray-500' />
                Email
              </label>
              <Input
                type='email'
                value={editedUser?.email || ''}
                disabled={!isEditing}
                onChange={e => handleChange('email', e.target.value)}
              />
            </div>

            {/* Avatar */}
            <div>
              <label className='flex items-center text-sm font-medium text-gray-700'>
                <ImageIcon className='mr-2 h-4 w-4 text-gray-500' />
                Avatar URL
              </label>
              <Input
                type='text'
                value={editedUser?.avatar || ''}
                disabled={!isEditing}
                onChange={e => handleChange('avatar', e.target.value)}
              />
            </div>

            {/* Premium Status */}
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Premium Status
              </label>
              <select
                value={editedUser?.isHavePremium ? 'true' : 'false'}
                disabled={!isEditing}
                onChange={e =>
                  handleChange('isHavePremium', e.target.value === 'true')
                }
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              >
                <option value='false'>Standard</option>
                <option value='true'>Premium</option>
              </select>
            </div>
          </div>
        </div>
      </ScrollArea>
    </PageContainer>
  )
}
