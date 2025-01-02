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
  searchParams: Promise<SearchParams>; // searchParams as a Promise
}

const OrderPage = async ({ searchParams }: OrderPageProps) => {
  // Resolve the `searchParams` Promise safely
  const resolvedSearchParams = await searchParams
    .then((params) => {
      searchParamsCache.parse(params); // Process the resolved params
      return params;
    })
    .catch((error) => {
      console.error('Failed to resolve searchParams:', error);
      throw new Error('Invalid search parameters');
    });

  try {
    // Fetch orders from the API
    const orders: OrderData[] = await fetchOrders();
    const totalOrders = orders.length;

    return (
      <NuqsAdapter>
        <OrderListingPage
          orders={orders}
          totalOrders={totalOrders}
        // Pass resolved params to the component
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
