'use client';
import PageContainer from '@/components-admin/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { OrderData } from '@/app/api/orderService';
import { Button } from '@/components/ui/button';
import OrderTable from './orders-tables';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { fetchUserById, User } from '@/app/admin/api/user'
import { transferToPayPal } from '@/app/api/paypalService'; // Assume this is your PayPal service

interface OrderListingPageProps {
  orders: OrderData[];
  totalOrders: number;
}

export default function OrderListingPage({ 
  orders,
  totalOrders 
}: OrderListingPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userNames, setUserNames] = useState<Record<string, User>>({});
  const [sellerNames, setSellerNames] = useState<Record<string, User>>({});

  useEffect(() => {
    const fetchNames = async () => {
      // Fetch user names
      const userPromises = orders.map(order => fetchUserById(order.userId));
      const users = await Promise.all(userPromises);
      const userMap = users.reduce((acc, user, index) => {
        acc[orders[index].userId] = user;
        return acc;
      }, {} as Record<string, User>);
      setUserNames(userMap);

      // Fetch seller names
      const sellerPromises = orders.map(order => fetchUserById(order.sellerId));
      const sellers = await Promise.all(sellerPromises);
      const sellerMap = sellers.reduce((acc, seller, index) => {
        acc[orders[index].sellerId] = seller;
        return acc;
      }, {} as Record<string, User>);
      setSellerNames(sellerMap);
    };
    fetchNames();
  }, [orders]);

  useEffect(() => {
    const autoTransferToPayPal = async () => {
      for (const order of orders) {
        if (order.status === 'Success') {
          const amountToTransfer = order.totalPrice * 0.8;
          const user = userNames[order.userId];
          if (user && user.email) {
            try {
              await transferToPayPal(user.email, amountToTransfer);
              console.log(`Transferred $${amountToTransfer} for order ${order.id} to PayPal account ${user.email}`);
            } catch (error) {
              console.error(`Failed to transfer for order ${order.id}:`, error);
            }
          }
        }
      }
    };
    autoTransferToPayPal();
  }, [orders, userNames]);

  const filteredOrders = orders
    .filter(order => 
      (statusFilter ? order.status === statusFilter : true) &&
      (searchQuery ? 
        order.userId.includes(searchQuery) || 
        order.productId.includes(searchQuery) ||
        order.sellerId.includes(searchQuery) : true)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    totalAmount: filteredOrders.reduce((sum, order) => sum + Number(order.totalPrice), 0),
    paidOrders: filteredOrders.filter(order => order.status === 'Paid').length,
    successOrders: filteredOrders.filter(order => order.status === 'Success').length,
    failedOrders: filteredOrders.filter(order => order.status === 'Failed').length,
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders Management</h1>
            <p className="text-lg text-white">View and manage all customer orders</p>
            <div className="mt-4 flex items-center gap-4 text-[24px] font-bold">
              <span className="text-black">Total Orders: <span className="text-yellow-300">{filteredOrders.length}</span></span>
              <span className="text-black">Total Revenue: <span className="text-green-300">${(stats.totalAmount).toFixed(2)}</span></span>
              <span className="text-black">Total Transfer: <span className="text-green-300">${(stats.totalAmount * 0.8).toFixed(2)}</span></span>
              <span className="text-black">Total Remaining: <span className="text-green-300">${(stats.totalAmount * 0.2).toFixed(2)}</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
              Export CSV
            </Button>
            <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
              Download Report
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Filter Section */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by User ID or Product ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Success">Success</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Total Orders
              </div>
              <div className="text-2xl font-bold">{filteredOrders.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Paid Orders
              </div>
              <div className="text-2xl font-bold">
                {stats.paidOrders}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Success Orders
              </div>
              <div className="text-2xl font-bold">
                {stats.successOrders}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-400 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Failed Orders
              </div>
              <div className="text-2xl font-bold">
                {stats.failedOrders}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <OrderTable 
              data={filteredOrders} 
              totalData={totalOrders} 
              renderRowActions={(order) => (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600">
                      Customer: {userNames[order.userId]?.name || 'Loading...'}
                    </span>
                    <span className="text-sm text-gray-600">
                      Seller: {sellerNames[order.sellerId]?.name || 'Loading...'}
                    </span>
                    {order.status === 'Success' && (
                      <div className="text-sm text-green-600">
                        Transferred to PayPal: ${(order.totalPrice * 0.8).toFixed(2)}
                      </div>
                    )}
                  </div>
                </>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
