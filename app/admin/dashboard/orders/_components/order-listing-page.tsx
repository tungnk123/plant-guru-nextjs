import PageContainer from '@/components-admin/layout/page-container';
import { Separator } from '@/components/ui/separator';
import { OrderData } from '@/app/api/orderService';
import { Button } from '@/components/ui/button';
import { Filter, Download, FileDown } from 'lucide-react';
import OrderTable from './orders-tables';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface OrderListingPageProps {
  orders: OrderData[];
  totalOrders: number;
}

export default function OrderListingPage({ 
  orders,
  totalOrders 
}: OrderListingPageProps) {
  const stats = {
    totalAmount: orders.reduce((sum, order) => sum + Number(order.totalPrice), 0),
    paidOrders: orders.filter(order => order.status === 'Paid').length,
    pendingOrders: orders.filter(order => order.status === 'Pending').length,
    failedOrders: orders.filter(order => order.status === 'Failed').length,
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders Management</h1>
            <p className="text-lg text-white">View and manage all customer orders</p>
            <div className="mt-4 flex items-center gap-4 text-2xl font-bold">
              <span className="text-yellow-300">Total Orders: {totalOrders}</span>
              <span>•</span>
              <span className="text-green-300">Total Revenue: ${stats.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Orders</SheetTitle>
                  <SheetDescription>
                    Apply filters to find specific orders
                  </SheetDescription>
                </SheetHeader>
                {/* Add your filter controls here */}
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="default" size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Total Orders
              </div>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Paid Orders
              </div>
              <div className="text-2xl font-bold">
                {stats.paidOrders}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="text-sm font-medium">
                Pending Orders
              </div>
              <div className="text-2xl font-bold">
                {stats.pendingOrders}
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
              data={orders} 
              totalData={totalOrders} 
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
