'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchProductById, ProductData } from '@/app/api/productService';
import { createOrder, confirmPayment } from '@/app/api/orderService';
import BreadcrumbNavigation from '@/app/components/navbar/BreadcrumbNavigation';
import Navbar from '@/app/components/navbar/Navbar';
import OutOfStockBadge from '@/app/components/OutOfStockBadge';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, MapPin } from 'lucide-react';

const ConfirmationPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (id) {
      const loadProduct = async () => {
        try {
          const data = await fetchProductById(id as string);
          setProduct(data);
          setTotalPrice(data.price);
        } catch (error) {
          console.error('Failed to load product:', error);
        }
      };

      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const value = parseInt(inputValue);

    if (inputValue === '') {
      setQuantity(0);
      return;
    }

    if (isNaN(value)) {
      return;
    }

    if (value < 1) {
      setQuantity(1);
      return;
    }

    if (product && value > product.quantity) {
      toast({
        title: "Quantity Limit Exceeded",
        description: `Maximum available quantity is ${product.quantity}`,
        variant: "destructive",
      });
      setQuantity(product.quantity);
      return;
    }

    setQuantity(value);
  };

  const handleConfirmPurchase = async () => {
    if (!product || !userId) return;

    const paypalScript = document.createElement('script');
    paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
    paypalScript.onload = () => {
      // @ts-ignore
      paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalPrice.toFixed(2),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async (details) => {
            try {
              const orderData = {
                userId,
                productId: product.id,
                sellerId: product.sellerId, // Ensure sellerId is part of product
                quantity,
                shippingAddress,
              };

              const order = await createOrder(orderData);
              console.log('Order created successfully:', order);

              await confirmPayment(order.id);
              console.log('Payment confirmed successfully');

              toast({
                title: 'Order placed successfully',
                description: `Order ${order.id} placed successfully`,
                variant: 'success',
              });
            } catch (error) {
              console.error('Error processing order:', error);
            }
          });
        },
        onError: (err) => {
          console.error('PayPal Checkout onError:', err);
        },
      }).render('#paypal-button-container');
    };
    document.body.appendChild(paypalScript);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar toggle={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbNavigation productName={product?.productName || ''} />
        
        <Card className="mt-8 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-orange-500/10 to-transparent">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-2xl font-bold">Order Confirmation</CardTitle>
            </div>
            <CardDescription>Review your order details below</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={product?.productImages[0] || '/images/ic_logo.svg'}
                    alt={product?.productName}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                  {product?.quantity === 0 && <OutOfStockBadge />}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-orange-50 to-transparent p-4 rounded-lg">
                  <h2 className="text-3xl font-bold text-gray-900">{product?.productName}</h2>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      ${product?.price.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      Stock: {product?.quantity} available
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-orange-500/20 to-transparent" />

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-orange-500" />
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity || ''}
                    onChange={handleQuantityChange}
                    onBlur={() => {
                      if (quantity < 1) setQuantity(1);
                    }}
                    min="1"
                    max={product?.quantity}
                    className="w-full bg-white/50 backdrop-blur-sm border-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    Shipping Address
                  </Label>
                  <Input
                    id="shipping"
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full bg-white/50 backdrop-blur-sm border-orange-500/20 focus:border-orange-500"
                    placeholder="Enter your shipping address"
                  />
                </div>

                <Separator className="bg-gradient-to-r from-orange-500/20 to-transparent" />

                <div className="bg-gradient-to-r from-orange-50 to-transparent p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Total Price:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div id="paypal-button-container" className="w-full" />

                <Button
                  onClick={handleConfirmPurchase}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                  size="lg"
                  disabled={!product || product.quantity === 0 || quantity < 1}
                >
                  Confirm Purchase
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmationPage;
