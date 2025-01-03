'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Crown,
  Mail,
  User,
  Calendar,
  Shield,
  LogOut,
  Edit,
  Trash2,
  Plus,
  CheckCircle
} from 'lucide-react'
import Navbar from '@/app/components/navbar/Navbar'
import { fetchUserById } from '@/app/admin/api/user'
import {
  fetchProductsByUser,
  ProductData,
  deleteProduct,
  fetchProductById
} from '@/app/api/productService'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import OutOfStockBadge from '@/app/components/OutOfStockBadge'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import {
  fetchOrdersByUser,
  OrderData,
  fetchOrdersForShop,
  markOrderAsFailed,
  markOrderAsSuccess,
  denyOrder,
  EnhancedOrderData,
  fetchOrders
} from '@/app/api/orderService'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { fetchUserExperience, getUserLevel } from '@/app/api/experienceService'

interface User {
  userId: string
  name: string
  email: string
  avatar: string
  isHavePremium: boolean
  createdAt?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [orders, setOrders] = useState<EnhancedOrderData[]>([])
  const [shopOrders, setShopOrders] = useState<EnhancedOrderData[]>([])
  const [activeTab, setActiveTab] = useState('profile')
  const router = useRouter()
  const [experiencePoints, setExperiencePoints] = useState<number>(0)
  const [userLevel, setUserLevel] = useState<{
    level: number
    nextLevelPoints: number | null
  }>({ level: 0, nextLevelPoints: null })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserId = localStorage.getItem('userId')
        if (!storedUserId) {
          router.push('/login')
          return
        }

        const userData = await fetchUserById(storedUserId)
        setUser(userData)

        const { experiencePoints } = await fetchUserExperience(storedUserId)
        setExperiencePoints(experiencePoints)

        const levelData = getUserLevel(experiencePoints)
        setUserLevel(levelData)

        const ordersData = await fetchOrdersByUser(storedUserId)
        const sortedOrders = ordersData.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        const ordersWithProductInfo = await Promise.all(
          ordersData.map(async order => {
            const product = await fetchProductById(order.productId)
            return {
              ...order,
              productName: product.productName,
              productImage:
                product.productImages.length > 0
                  ? product.productImages[0]
                  : '/images/ic_logo.svg'
            }
          })
        )
        setOrders(ordersWithProductInfo)

        if (userData.isHavePremium) {
          const productsData = await fetchProductsByUser(storedUserId)
          setProducts(productsData)

          const shopOrdersData = await fetchOrdersForShop(storedUserId)
          const ordersWithProductInfo: EnhancedOrderData[] = await Promise.all(
            ordersData.map(async order => {
              const product = await fetchProductById(order.productId)
              return {
                ...order,
                productName: product.productName,
                productImage:
                  product.productImages.length > 0
                    ? product.productImages[0]
                    : '/images/ic_logo.svg'
              }
            })
          )
          setOrders(ordersWithProductInfo)
        }
      } catch (error) {
        toast.error('Error loading profile')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleSignOut = () => {
    localStorage.clear()
    router.push('/login')
    toast.success('Signed out successfully')
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      toast.success('Product deleted successfully')
      // Optionally, remove the deleted product from the state
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      )
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleConfirmOrder = async (orderId: string) => {
    const userConfirmed = window.confirm(
      'Are you sure you want to confirm this order?'
    )
    if (userConfirmed) {
      try {
        await markOrderAsSuccess(orderId)
        toast.success('Order confirmed successfully')
        setShopOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'Success' } : order
          )
        )
      } catch (error) {
        toast.error('Failed to confirm order')
      }
    }
  }

  const handleDenyOrder = async (orderId: string) => {
    const userConfirmed = window.confirm(
      'Are you sure you want to deny this order?'
    )
    if (userConfirmed) {
      try {
        await markOrderAsFailed(orderId)
        toast.success('Order denied successfully')
        setShopOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'Failed' } : order
          )
        )
      } catch (error) {
        toast.error('Failed to deny order')
      }
    }
  }

  const handleConfirmReceipt = async (orderId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${orderId}/confirm-receipt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to confirm receipt')
      }

      toast.success('Order received successfully!')
      fetchOrders()
      router.refresh()
    } catch (error) {
      console.error('Error confirming receipt:', error)
      toast.error('Failed to confirm receipt')
    } finally {
      setLoading(false)
    }
  }

  const handleMyPostClick = () => {
    if (user) {
      router.push(`/profile/${user.userId}`)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) return null

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <Navbar toggle={() => {}} />
      <div className='mx-auto flex max-w-6xl px-4 pb-12 pt-24'>
        <Card className='flex-grow shadow-xl'>
          <CardHeader className='border-b bg-white/50 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-3xl font-bold text-gray-800'>
                  Profile
                </CardTitle>
                <CardDescription className='mt-2 text-gray-500'>
                  Manage your account settings and preferences
                </CardDescription>
              </div>
              {user.isHavePremium ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className='flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 px-4 py-2 text-yellow-700'>
                        <Crown className='h-5 w-5' />
                        <span className='font-medium'>Premium Member</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You have access to all premium features</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700'
                  onClick={() => router.push('/pricing')}
                >
                  <Crown className='mr-2 h-5 w-5' />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='mb-6 flex space-x-4'>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'outline'}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </Button>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'outline'}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </Button>
              {user.isHavePremium && (
                <Button
                  variant={activeTab === 'shop' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('shop')}
                >
                  Shop
                </Button>
              )}
              <div className='flex-grow'></div>
              <Button
                className='bg-black text-white'
                onClick={handleMyPostClick}
              >
                My Post
              </Button>
            </div>
            {activeTab === 'profile' && (
              <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                <div className='col-span-1'>
                  <div className='aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner'>
                    <img
                      src={user.avatar || '/images/ic_user.svg'}
                      alt={user.name}
                      className='h-full w-full object-cover'
                      onError={e => {
                        ;(e.target as HTMLImageElement).src =
                          '/images/ic_user.svg'
                      }}
                    />
                  </div>
                  <div className='mt-6 space-y-4'>
                    <Badge
                      variant='outline'
                      className='w-full justify-center py-2'
                    >
                      {user.isHavePremium ? 'Premium Account' : 'Basic Account'}
                    </Badge>
                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={handleSignOut}
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className='col-span-2 space-y-6'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <label className='flex items-center gap-2 text-sm text-gray-500'>
                        <User className='h-4 w-4' />
                        Name
                      </label>
                      <p className='rounded-lg border bg-white/50 p-3 text-lg font-medium text-gray-900 backdrop-blur-sm'>
                        {user.name || 'Not set'}
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <label className='flex items-center gap-2 text-sm text-gray-500'>
                        <Mail className='h-4 w-4' />
                        Email
                      </label>
                      <p className='rounded-lg border bg-white/50 p-3 text-lg font-medium text-gray-900 backdrop-blur-sm'>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className='mb-8 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-semibold text-gray-700'>
                        Level:{' '}
                        <span className='text-indigo-600'>
                          {userLevel.level}
                        </span>
                      </span>
                      {userLevel.nextLevelPoints && (
                        <span className='text-sm font-medium text-gray-500'>
                          {Math.floor(userLevel.nextLevelPoints) -
                            Math.floor(experiencePoints)}{' '}
                          points to next level
                        </span>
                      )}
                    </div>

                    <div className='relative h-6 w-full rounded-full bg-gray-100 shadow-inner'>
                      <div
                        className='absolute h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow'
                        style={{
                          width: `${((experiencePoints / (userLevel.nextLevelPoints || 1)) * 100).toFixed(2)}%`
                        }}
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className='absolute inset-0 cursor-pointer' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='text-sm font-medium'>
                              {Math.floor(experiencePoints)} /{' '}
                              {userLevel.nextLevelPoints
                                ? Math.floor(userLevel.nextLevelPoints)
                                : 'N/A'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <h3 className='flex items-center gap-2 text-lg font-semibold'>
                      <Shield className='h-5 w-5 text-gray-500' />
                      Account Status
                    </h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div className='rounded-lg border bg-white/50 p-4 backdrop-blur-sm'>
                        <p className='text-sm text-gray-500'>Member Since</p>
                        <p className='text-base font-medium text-gray-900'>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div className='rounded-lg border bg-white/50 p-4 backdrop-blur-sm'>
                        <p className='text-sm text-gray-500'>Account Type</p>
                        <p className='text-base font-medium text-gray-900'>
                          {user.isHavePremium ? 'Premium' : 'Basic'} Account
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
              <div>
                <h3 className='mb-4 text-lg font-semibold'>Your Orders</h3>
                {orders.length > 0 ? (
                  <ul className='max-h-96 space-y-4 overflow-y-auto'>
                    {orders.map(order => (
                      <Link
                        href={`/products/${order.productId}`}
                        key={order.id}
                      >
                        <li className='mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg'>
                          <div className='mb-2 flex items-center justify-between'>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              {order.status}
                            </span>
                            <p className='text-sm text-gray-500'>
                              {format(
                                new Date(order.createdAt),
                                'MMMM dd, yyyy'
                              )}
                            </p>
                          </div>
                          <div className='flex items-center text-sm text-gray-600'>
                            <img
                              src={order.productImage}
                              alt={order.productName}
                              className='mr-4 h-16 w-16 rounded object-cover'
                            />
                            <div>
                              <p>
                                <strong>Product:</strong> {order.productName}
                              </p>
                              <p>
                                <strong>Total Price:</strong> $
                                {order.totalPrice.toFixed(2)}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {order.quantity}
                              </p>
                              <p>
                                <strong>Shipping Address:</strong>{' '}
                                {order.shippingAddress}
                              </p>
                            </div>
                          </div>
                          {order.status === 'Paid' && (
                            <div className='mt-4 flex space-x-2'>
                              <Button
                                variant='default'
                                onClick={() => handleConfirmOrder(order.id)}
                              >
                                Confirm get product
                              </Button>
                            </div>
                          )}
                        </li>
                      </Link>
                    ))}
                  </ul>
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            )}
            {activeTab === 'shop' && user.isHavePremium && (
              <div>
                <h3 className='mb-4 text-lg font-semibold'>Your Shop</h3>
                <div className='mb-5 flex items-center justify-between'>
                  <div className='flex space-x-2'>
                    <Button
                      variant='outline'
                      onClick={() => setEditMode(!editMode)}
                      className='flex items-center'
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => router.push('/create-product')}
                      className='flex items-center'
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Create Product
                    </Button>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                  {products.map(product => (
                    <div
                      key={product.id}
                      className='relative block cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-orange-500 hover:shadow-lg'
                    >
                      <Link
                        href={
                          editMode
                            ? `/products/edit/${product.id}`
                            : `/products/${product.id}`
                        }
                      >
                        <img
                          className='h-48 w-full object-cover'
                          src={
                            product.productImages.length > 0
                              ? product.productImages[0]
                              : '/images/ic_logo.svg'
                          }
                          alt={product.productName}
                        />
                        {product.quantity === 0 && <OutOfStockBadge />}
                        <div className='p-4'>
                          <h3 className='text-lg font-semibold text-gray-800'>
                            {product.productName}
                          </h3>
                          <p className='font-medium text-orange-500'>
                            ${product.price.toFixed(2)}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Stock: {product.quantity}
                          </p>
                        </div>
                      </Link>
                      {editMode && (
                        <div className='absolute right-2 top-2'>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {user.isHavePremium && activeTab === 'shop' && (
          <aside className='ml-4 w-96'>
            <Card className='shadow-xl'>
              <CardHeader className='border-b bg-white/50 backdrop-blur-sm'>
                <CardTitle className='text-lg font-semibold'>
                  Orders for Your Shop
                </CardTitle>
              </CardHeader>
              <CardContent className='p-4'>
                {shopOrders.length > 0 ? (
                  <ul className='max-h-96 space-y-4 overflow-y-auto'>
                    {shopOrders.map(order => (
                      <li
                        key={order.id}
                        className='rounded-lg border border-gray-200 bg-white p-4 shadow-md'
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                          >
                            {order.status}
                          </span>
                          <p className='text-sm text-gray-500'>
                            {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                        <div className='flex items-center text-sm text-gray-600'>
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className='mr-4 h-16 w-16 rounded object-cover'
                          />
                          <div>
                            <p>
                              <strong>Product:</strong> {order.productName}
                            </p>
                            <p>
                              <strong>Total Price:</strong> $
                              {order.totalPrice.toFixed(2)}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {order.quantity}
                            </p>
                            <p>
                              <strong>Shipping Address:</strong>{' '}
                              {order.shippingAddress}
                            </p>
                          </div>
                        </div>
                        {order.status === 'Paid' && (
                          <div className='mt-4 flex space-x-2'>
                            <Button
                              variant='default'
                              onClick={() => handleConfirmOrder(order.id)}
                            >
                              Accept Order
                            </Button>
                            <Button
                              variant='destructive'
                              onClick={() => handleDenyOrder(order.id)}
                            >
                              Deny Order
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No orders for your shop found.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        )}
      </div>
    </div>
  )
}
