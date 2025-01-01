'use client';
import React, { useState, useEffect } from 'react';
import { SearchParams } from 'nuqs';
import ProfileViewPage from './_components/profile-view-page';
import { fetchOrdersByUser, OrderData } from "@/app/api/orderService";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Dashboard : Profile'
};

export default function Page({ searchParams }: pageProps) {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrdersByUser(userId || '');
      setOrders(data);
    };
    loadOrders();
  }, [userId]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        </div>

        <div className="grid gap-4">
          {/* Personal Information Card */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            {/* Personal info content */}
          </Card>

          {/* Orders Card */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">My Orders</h3>
            <div className="space-y-4">
              {orders?.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-medium">{order.status}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: ${order.totalPrice}
                    </p>
                  </div>

                  {order.status === "Paid" && (
                    <ConfirmReceiptButton orderId={order.id} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Separate client component for the button
'use client';

interface ConfirmReceiptButtonProps {
  orderId: string;
}

function ConfirmReceiptButton({ orderId }: ConfirmReceiptButtonProps) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleConfirmReceipt = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}/confirm-receipt`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to confirm receipt');
      }

      toast.success("Order received successfully!");
      router.refresh();
    } catch (error) {
      console.error('Error confirming receipt:', error);
      toast.error("Failed to confirm receipt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConfirmReceipt}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
      size="sm"
    >
      <CheckCircle className="w-4 h-4" />
      {loading ? "Confirming..." : "Confirm Receipt"}
    </Button>
  );
}
