import { ColumnDef } from '@tanstack/react-table';
import { Membership } from '@/app/admin/api/membership';
import { Checkbox } from '@/components/ui/checkbox';
import { CellAction } from './cell-action'; // Import CellAction component

export const membershipColumns = (
  onMembershipUpdate: (membership: Membership) => void,
  onDeleteMembership: (id: string) => void // Add onDeleteMembership callback
): ColumnDef<Membership>[] => [
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
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div>
        {row.original.description.length > 50
          ? `${row.original.description.slice(0, 50)}...`
          : row.original.description}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'lastModifiedAt',
    header: 'Last Modified At',
    cell: ({ row }) => row.original.lastModifiedAt
      ? new Date(row.original.lastModifiedAt).toLocaleDateString()
      : 'N/A',
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <CellAction
        data={row.original}
        onMembershipUpdate={onMembershipUpdate}
        onDeleteMembership={onDeleteMembership}
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
];
