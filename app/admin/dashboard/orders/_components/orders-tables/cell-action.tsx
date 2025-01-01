'use client';
import { AlertModal } from '@/components-admin/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  MoreHorizontal, 
  Trash, 
  Eye, 
  PackageCheck, 
  XCircle,
  Truck,
  Receipt 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ORDER_BASE_URL = 'https://un-silent-backend-develop.azurewebsites.net/api/orders';

export interface OrderData {
  id: string;
  userId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export const createOrder = async (orderData: Pick<OrderData, 'userId' | 'productId' | 'sellerId' | 'quantity' | 'shippingAddress'>): Promise<OrderData> => {
  try {
    const response = await fetch(ORDER_BASE_URL, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const confirmOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/confirmOrder?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to confirm order: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error confirming order:', error);
    throw error;
  }
};

export const denyOrder = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/markAsFailedOrder?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to deny order: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error denying order:', error);
    throw error;
  }
};

export const markOrderAsSuccess = async (orderId: string): Promise<void> => {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/markAsSuccessOrder?orderId=${orderId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to mark order as success: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error marking order as success:', error);
    throw error;
  }
};

interface CellActionProps {
  data: OrderData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onConfirm = async () => {
    try {
      setLoading(true);
      await fetch(`${ORDER_BASE_URL}/${data.id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });
      toast({
        title: "Order Deleted",
        description: `Order #${data.id.slice(0, 8)} has been deleted.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while deleting the order.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);
      if (newStatus === 'processing') {
        await confirmOrder(data.id);
      } else if (newStatus === 'completed') {
        await markOrderAsSuccess(data.id);
      } else if (newStatus === 'cancelled') {
        await denyOrder(data.id);
      }

      toast({
        title: "Status Updated",
        description: `Order #${data.id.slice(0, 8)} status changed to ${newStatus}.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusActions = () => {
    switch (data.status) {
      case 'pending':
        return (
          <DropdownMenuItem onClick={() => handleStatusUpdate('processing')}>
            <PackageCheck className="mr-2 h-4 w-4 text-blue-500" />
            Mark as Processing
          </DropdownMenuItem>
        );
      case 'processing':
        return (
          <DropdownMenuItem onClick={() => handleStatusUpdate('completed')}>
            <Truck className="mr-2 h-4 w-4 text-green-500" />
            Mark as Completed
          </DropdownMenuItem>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Delete Order"
        description="Are you sure you want to delete this order? This action cannot be undone."
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-orange-50"
            disabled={loading}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/orders/${data.id}`)}>
            <Eye className="mr-2 h-4 w-4 text-gray-500" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/orders/${data.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4 text-blue-500" />
            Edit Order
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => window.print()}>
            <Receipt className="mr-2 h-4 w-4 text-green-500" />
            Print Invoice
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {getStatusActions()}

          {data.status !== 'cancelled' && (
            <DropdownMenuItem onClick={() => handleStatusUpdate('cancelled')}>
              <XCircle className="mr-2 h-4 w-4 text-red-500" />
              Cancel Order
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={() => setOpen(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
