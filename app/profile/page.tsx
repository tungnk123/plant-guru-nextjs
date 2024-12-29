"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Mail, User, Calendar, Shield, LogOut, Edit, Trash2, Plus } from 'lucide-react';
import Navbar from '@/app/components/navbar/Navbar';
import { fetchUserById } from '@/app/admin/api/user';
import { fetchProductsByUser, ProductData, deleteProduct } from '@/app/api/productService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { fetchOrdersByUser, OrderData } from '@/app/api/orderService';

interface User {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  isHavePremium: boolean;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        console.log('Current stored userId:', storedUserId);

        if (!storedUserId) {
          console.error('No userId in localStorage');
          router.push('/login');
          return;
        }

        console.log('Fetching fresh data for userId:', storedUserId);
        const userData = await fetchUserById(storedUserId);
        console.log('API Response:', userData);

        if (userData && userData.userId && userData.email) {
          console.log('Setting user data:', userData);
          setUser(userData);
          
          localStorage.setItem('userData', JSON.stringify({
            ...userData,
            lastUpdated: new Date().toISOString()
          }));

          // Fetch products if the user is premium
          if (userData.isHavePremium) {
            const productsData = await fetchProductsByUser(storedUserId);
            setProducts(productsData);
          }

          // Fetch orders if the user is not premium
          if (!userData.isHavePremium) {
            const ordersData = await fetchOrdersByUser(storedUserId);
            setOrders(ordersData);
          }
        } else {
          console.log('Unexpected user data structure:', userData);
          toast.error('Could not load user profile');
          router.push('/login');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error('Error loading profile');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSignOut = () => {
    localStorage.clear();
    router.push('/login');
    toast.success('Signed out successfully');
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
      // Optionally, remove the deleted product from the state
      setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar toggle={() => {}} />
      <div className="max-w-5xl mx-auto pt-24 px-4 pb-12">
        <Card className="shadow-xl">
          <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800">Profile</CardTitle>
                <CardDescription className="text-gray-500 mt-2">
                  Manage your account settings and preferences
                </CardDescription>
              </div>
              {user.isHavePremium ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 text-yellow-700 px-4 py-2 rounded-full">
                        <Crown className="h-5 w-5" />
                        <span className="font-medium">Premium Member</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You have access to all premium features</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700"
                  onClick={() => router.push('/pricing')}
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex space-x-4 mb-6">
              <Button variant={activeTab === 'profile' ? 'default' : 'outline'} onClick={() => setActiveTab('profile')}>
                Profile
              </Button>
              {!user.isHavePremium && (
                <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')}>
                  Orders
                </Button>
              )}
            </div>
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
                    <img 
                      src={user.avatar || '/images/ic_user.svg'} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/ic_user.svg';
                      }}
                    />
                  </div>
                  <div className="mt-6 space-y-4">
                    <Badge variant="outline" className="w-full justify-center py-2">
                      {user.isHavePremium ? 'Premium Account' : 'Basic Account'}
                    </Badge>
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className="col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name
                      </label>
                      <p className="text-lg font-medium text-gray-900 bg-white/50 backdrop-blur-sm rounded-lg p-3 border">
                        {user.name || 'Not set'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="text-lg font-medium text-gray-900 bg-white/50 backdrop-blur-sm rounded-lg p-3 border">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-gray-500" />
                      Account Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border">
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="text-base font-medium text-gray-900">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border">
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="text-base font-medium text-gray-900">
                          {user.isHavePremium ? 'Premium' : 'Basic'} Account
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.isHavePremium && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Your Shop</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setEditMode(!editMode)}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {editMode ? 'Cancel' : 'Edit'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => router.push('/create-product')}
                            className="flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Product
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                          <div key={product.id} className="relative block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-500 transition-all duration-200 cursor-pointer">
                            <Link href={editMode ? `/products/edit/${product.id}` : `/products/${product.id}`}>
                              <img
                                className="w-full h-48 object-cover"
                                src={product.productImages.length > 0 ? product.productImages[0] : '/images/ic_logo.svg'}
                                alt={product.productName}
                              />
                              {product.quantity === 0 && <OutOfStockBadge />}
                              <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
                                <p className="text-orange-500 font-medium">${product.price.toFixed(2)}</p>
                                <p className="text-sm text-gray-600">Stock: {product.quantity}</p>
                              </div>
                            </Link>
                            {editMode && (
                              <div className="absolute top-2 right-2">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
                {orders.length > 0 ? (
                  <ul className="space-y-4">
                    {orders.map((order) => (
                      <li key={order.id} className="bg-white p-4 rounded-lg shadow">
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No orders found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
