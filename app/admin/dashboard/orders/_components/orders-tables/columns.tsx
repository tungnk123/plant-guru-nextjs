'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderData } from '@/app/api/orderService';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Package, DollarSign, MapPin, User, Clock, Ban, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { label: string; class: string; icon: JSX.Element }> = {
    'Pending': { 
      label: 'Pending', 
      class: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="w-3 h-3 mr-1" />
    },
    'Not Paid': { 
      label: 'Not Paid', 
      class: 'bg-red-100 text-red-800',
      icon: <Ban className="w-3 h-3 mr-1" />
    },
    'Paid': { 
      label: 'Paid', 
      class: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="w-3 h-3 mr-1" />
    },
    'Failed': { 
      label: 'Failed', 
      class: 'bg-gray-100 text-gray-800',
      icon: <XCircle className="w-3 h-3 mr-1" />
    }
  };

  return statusMap[status] || statusMap['Pending'];
};

export const columns: ColumnDef<OrderData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: 'ORDER ID',
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        #{row.original.id.slice(0, 8)}
      </div>
    )
  },
  {
    accessorKey: 'userId',
    header: 'CUSTOMER',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
          <User className="w-4 h-4 text-orange-600" />
        </div>
        <div className="font-medium text-gray-700">
          {row.original.userId}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'orderDate',
    header: 'DATE',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-gray-500">
        <CalendarDays className="w-4 h-4" />
        {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusInfo = getStatusConfig(status);

      return (
        <Badge variant="outline" className={`${statusInfo.class} border-0`}>
          {statusInfo.icon}
          {statusInfo.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'TOTAL',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 font-medium text-gray-900">
        <DollarSign className="w-4 h-4 text-gray-500" />
        {Number(row.original.totalPrice).toFixed(2)}
      </div>
    )
  },
  {
    accessorKey: 'shippingAddress',
    header: 'SHIPPING',
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-gray-500 max-w-[200px]">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span className="truncate" title={row.original.shippingAddress}>
          {row.original.shippingAddress}
        </span>
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
