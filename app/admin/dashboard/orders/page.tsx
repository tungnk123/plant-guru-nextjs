import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs';
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import OrderListingPage from './_components/order-listing-page';
import { fetchOrders, OrderData } from '@/app/api/orderService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders Management',
  description: 'View and manage customer orders',
};

interface OrderPageProps {
  searchParams: Promise<SearchParams>; // Updated to Promise<SearchParams>
}

const OrderPage = async ({ searchParams }: OrderPageProps) => {
  try {
    // Await the resolution of searchParams
    const resolvedSearchParams = await searchParams;
    searchParamsCache.parse(resolvedSearchParams);

    // Fetch orders using the API
    const orders: OrderData[] = await fetchOrders();
    const totalOrders = orders.length;

    return (
      <NuqsAdapter>
        <OrderListingPage 
          orders={orders} 
          totalOrders={totalOrders} 
        />
      </NuqsAdapter>
    );
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">
          Failed to load orders. Please try again later.
        </p>
      </div>
    );
  }
};

export default OrderPage;
