"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Mail, User, Calendar, Shield, LogOut, Edit, Trash2, Plus } from 'lucide-react';
import Navbar from '@/app/components/navbar/Navbar';
import { fetchUserById } from '@/app/admin/api/user';
import { fetchProductsByUser, ProductData, deleteProduct, fetchProductById } from '@/app/api/productService';
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
import { fetchOrdersByUser, OrderData, fetchOrdersForShop, confirmOrder, denyOrder } from '@/app/api/orderService';
import { format } from 'date-fns';
import { fetchUserExperience, getUserLevel } from '@/app/api/user-exp-service';

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
  const [shopOrders, setShopOrders] = useState<OrderData[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const [experiencePoints, setExperiencePoints] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<{ level: number; nextLevelPoints: number | null }>({ level: 0, nextLevelPoints: null });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          router.push('/login');
          return;
        }

        const userData = await fetchUserById(storedUserId);
        setUser(userData);

        const ordersData = await fetchOrdersByUser(storedUserId);
        const ordersWithProductInfo = await Promise.all(
          ordersData.map(async (order) => {
            const product = await fetchProductById(order.productId);
            return { 
              ...order, 
              productName: product.productName,
              productImage: product.productImages.length > 0 ? product.productImages[0] : '/images/ic_logo.svg'
            };
          })
        );
        setOrders(ordersWithProductInfo);

        if (userData.isHavePremium) {
          const productsData = await fetchProductsByUser(storedUserId);
          setProducts(productsData);

          const shopOrdersData = await fetchOrdersForShop(storedUserId);
          const shopOrdersWithProductInfo = await Promise.all(
            shopOrdersData.map(async (order) => {
              const product = await fetchProductById(order.productId);
              return {
                ...order,
                productName: product.productName,
                productImage: product.productImages.length > 0 ? product.productImages[0] : '/images/ic_logo.svg'
              };
            })
          );
          setShopOrders(shopOrdersWithProductInfo);
        }

        // Fetch user experience points
        const experienceData = await fetchUserExperience(storedUserId);
        setExperiencePoints(experienceData.experiencePoints);
        setUserLevel(getUserLevel(experienceData.experiencePoints));

      } catch (error) {
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

  const handleConfirmOrder = async (orderId: string) => {
    const userConfirmed = window.confirm("Are you sure you want to accept this order?");
    if (userConfirmed) {
      try {
        await confirmOrder(orderId);
        toast.success('Order confirmed successfully');
        // Optionally, update the order status in the state
        setShopOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'Not Paid' } : order
          )
        );
      } catch (error) {
        toast.error('Failed to confirm order');
      }
    }
  };

  const handleDenyOrder = async (orderId: string) => {
    const userConfirmed = window.confirm("Are you sure you want to deny this order?");
    if (userConfirmed) {
      try {
        await denyOrder(orderId);
        toast.success('Order denied successfully');
        // Optionally, update the order status in the state
        setShopOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'Failed' } : order
          )
        );
      } catch (error) {
        toast.error('Failed to deny order');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar toggle={() => { }} />
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12 flex">
        <Card className="shadow-xl flex-grow">
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
              <Button variant={activeTab === 'orders' ? 'default' : 'outline'} onClick={() => setActiveTab('orders')}>
                Orders
              </Button>
              {user.isHavePremium && (
                <Button variant={activeTab === 'shop' ? 'default' : 'outline'} onClick={() => setActiveTab('shop')}>
                  Shop
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

                  <div className="mb-8">
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600 font-bold text-lg">Level: {userLevel.level}</span>
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-500 to-green-500"
                      style={{
                        width: `${((experiencePoints / (userLevel.nextLevelPoints || 1)) * 100).toFixed(2)}%`,
                      }}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="absolute inset-0 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{Math.floor(experiencePoints)} / {userLevel.nextLevelPoints ? Math.floor(userLevel.nextLevelPoints) : 'N/A'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {userLevel.nextLevelPoints && (
                  <p className="text-gray-600 text-sm mt-1 text-right">
                    Points needed to reach next level: {Math.floor(userLevel.nextLevelPoints) - Math.floor(experiencePoints)}
                  </p>
                )}
              </div>
                </div>
              </div>
            )}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
                {orders.length > 0 ? (
                  <ul className="space-y-4 max-h-96 overflow-y-auto">
                    {orders.map((order) => (
                      <Link href={`/products/${order.productId}`} key={order.id}>
                        <li className="bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.status}
                            </span>
                            <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <img
                              src={order.productImage}
                              alt={order.productName}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <p><strong>Product:</strong> {order.productName}</p>
                              <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                              <p><strong>Quantity:</strong> {order.quantity}</p>
                              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                            </div>
                          </div>
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
                <h3 className="text-lg font-semibold mb-4">Your Shop</h3>
                <div className="flex justify-between items-center mb-5">
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
              </div>
            )}
          </CardContent>
        </Card>
        {user.isHavePremium && activeTab === 'shop' && (
          <aside className="w-96 ml-4">
            <Card className="shadow-xl">
              <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
                <CardTitle className="text-lg font-semibold">Orders for Your Shop</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {shopOrders.length > 0 ? (
                  <ul className="space-y-4 max-h-96 overflow-y-auto">
                    {shopOrders.map((order) => (
                      <li key={order.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                          <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <img
                            src={order.productImage}
                            alt={order.productName}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <p><strong>Product:</strong> {order.productName}</p>
                            <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                          </div>
                        </div>
                        {order.status === 'Pending' && (
                          <div className="flex space-x-2 mt-4">
                            <Button
                              variant="default"
                              onClick={() => handleConfirmOrder(order.id)}
                            >
                              Accept Order
                            </Button>
                            <Button
                              variant="destructive"
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
  );
}
