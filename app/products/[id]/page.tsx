'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, fetchProductsByUser, ProductData } from '@/app/api/productService';
import { fetchUserById, User } from '@/app/admin/api/user';
import BreadcrumbNavigation from '@/app/components/navbar/BreadcrumbNavigation';
import Navbar from '@/app/components/navbar/Navbar';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShoppingCart, Store, Package, ChevronRight, ImageIcon } from "lucide-react";
import Link from 'next/link';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProducts, setUserProducts] = useState<ProductData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionLong, setIsDescriptionLong] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          setProduct(data);
          const userData = await fetchUserById(data.sellerId);
          setUser(userData);
          const productsData = await fetchProductsByUser(data.sellerId);
          setUserProducts(productsData);

          // Check if the description is long enough to require "See More"
          if (data.description.split(' ').length > 50) {
            setIsDescriptionLong(true);
          }

          // Check if the current user is the owner of the product
          const storedUserId = localStorage.getItem('userId');
          if (storedUserId === data.sellerId) {
            setIsOwner(true);
          }
        } catch (error) {
          console.error('Failed to load product or user data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.productImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [product]);

  const isUserLoggedIn = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const user = await fetchUserById(userId);
      return !!user;
    } catch {
      return false;
    }
  };

  const handleBuyNowClick = async () => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase this product.",
        variant: "destructive",
      });
      return;
    }

    if (product && !isOwner && product.quantity > 0) {
      router.push(`/products/confirmation/${product.id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-gray-50">
      <Navbar toggle={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation productName={product.productName} />
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Product Images Section */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={product.productImages[currentImageIndex]}
                  alt={product.productName}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
                {product.quantity === 0 && <OutOfStockBadge />}
              </div>
              
              <ScrollArea className="w-full mt-4">
                <div className="flex space-x-4 pb-4">
                  {product.productImages.map((image, index) => (
                    <div
                      key={index}
                      className={`relative flex-none aspect-square w-20 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                        index === currentImageIndex ? 'ring-2 ring-orange-500' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.productName} ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Product Details Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-bold">{product.productName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Package className="w-4 h-4 mr-1" />
                      {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      ${product.price.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <div className={`${!showFullDescription && isDescriptionLong ? 'line-clamp-3' : ''}`}>
                    {product.description}
                  </div>
                  {isDescriptionLong && (
                    <Button
                      variant="link"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-orange-600 hover:text-orange-700 p-0"
                    >
                      {showFullDescription ? 'Show Less' : 'Read More'}
                    </Button>
                  )}
                </div>

                <Separator className="bg-gradient-to-r from-orange-100 to-transparent" />

                <Button
                  onClick={() => router.push(`/products/confirmation/${product.id}`)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  size="lg"
                  disabled={product.quantity === 0 || isOwner}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOwner ? 'Cannot Buy Own Product' : 'Buy Now'}
                </Button>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/shop/${user.userId}`)}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Visit Shop
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Products */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">More from this Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="flex space-x-4 pb-4">
                    {userProducts.slice(0, 6).map((userProduct) => (
                      <Link
                        href={`/products/${userProduct.id}`}
                        key={userProduct.id}
                        className="flex-none w-48"
                      >
                        <Card className="h-full border hover:shadow-md transition-shadow">
                          <div className="aspect-square relative">
                            <img
                              src={userProduct.productImages[0]}
                              alt={userProduct.productName}
                              className="object-cover w-full h-full rounded-t-lg"
                            />
                          </div>
                          <CardContent className="p-3">
                            <p className="font-medium line-clamp-1">{userProduct.productName}</p>
                            <p className="text-sm text-orange-600">${userProduct.price.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 