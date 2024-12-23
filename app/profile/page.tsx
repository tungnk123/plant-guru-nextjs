"use client";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Mail, User, Calendar, Shield, LogOut } from 'lucide-react';
import Navbar from '@/app/components/navbar/Navbar';
import { fetchUserById } from '@/app/admin/api/user';
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
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
