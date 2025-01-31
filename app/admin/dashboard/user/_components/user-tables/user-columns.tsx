import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './cell-action'; // Import CellAction component

export const userColumns = (onUserUpdate: (user: User) => void): ColumnDef<User>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select this row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        {row.original.email.length > 30
          ? `${row.original.email.slice(0, 30)}...`
          : row.original.email}
      </div>
    ),
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <img
        src={row.original.avatar || '/images/ic_user.svg'}
        alt={`${row.original.name}'s avatar`}
        style={{
          width: '32px',
          height: 'px',
          objectFit: 'cover',
          borderRadius: '50%',
        }}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'isHavePremium',
    header: 'Premium',
    cell: ({ row }) => (row.original.isHavePremium ? 'Yes' : 'No'),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CellAction data={row.original} onUserUpdate={onUserUpdate} />, // Pass onUserUpdate here
    enableSorting: false,
    enableHiding: true,
  },
];
