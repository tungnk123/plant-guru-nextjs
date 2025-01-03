'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Post } from '@/constants/data';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip } from '@/components/ui/tooltip';
import { format } from 'date-fns';

// Define a function to dynamically generate columns with onUpdate
export const getPostColumns = (onUpdate: () => void): ColumnDef<Post>[] => [
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
    accessorKey: 'id',
    header: 'Post ID',
    enableSorting: true,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <Tooltip>
        <div>
          {row.original.description.length > 50
            ? `${row.original.description.slice(0, 50)}...`
            : row.original.description}
        </div>
      </Tooltip>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => (
      <img
        src={row.original.imageUrl || '/images/img_default_post.png'}
        alt={row.original.title || 'Post image'}
        style={{
          width: '50px',
          height: '50px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'tag',
    header: 'Tag',
    enableSorting: true,
  },
  {
    accessorKey: 'background',
    header: 'Background',
    cell: ({ row }) => (
      <img
        src={row.original.imageUrl || '/public/images/img_default_post.png'}
        alt="Background"
        style={{
          width: '50px',
          height: '50px',
          objectFit: 'cover',
          borderRadius: '4px',
        }}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const dateStr = row.original.createdDateDatetime;
      if (dateStr === '0001-01-01T00:00:00') {
        return 'Not Available';
      }
      try {
        // Định dạng ngày giờ theo kiểu dễ đọc
        return format(new Date(dateStr), 'dd/MM/yyyy HH:mm:ss');
      } catch (error) {
        return 'Invalid Date';
      }
    },
    enableSorting: true,
  },
  {
    accessorKey: 'postUpvotes',
    header: 'Upvotes',
    cell: ({ row }) => row.original.postUpvotes,
    enableSorting: false,
  },
  {
    accessorKey: 'postDevotes',
    header: 'Downvotes',
    cell: ({ row }) => row.original.postDevotes,
    enableSorting: false,
  },
  {
    accessorKey: 'postComments',
    header: 'Comments',
    cell: ({ row }) => row.original.postComments,
    enableSorting: false,
  },
  {
    accessorKey: 'postShares',
    header: 'Shares',
    cell: ({ row }) => row.original.postShares,
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Tooltip>
        <CellAction data={row.original} onUpdate={onUpdate} />
      </Tooltip>
    ),
    enableSorting: false,
    enableHiding: true,
  },
];
