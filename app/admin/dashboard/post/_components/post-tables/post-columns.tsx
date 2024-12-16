'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Post } from '@/constants/data';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip } from '@/components/ui/tooltip';

export const postColumns: ColumnDef<Post>[] = [
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
        src={row.original.imageUrl || 'img_default_post.png'}
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
        src={'/images/img_default_post.png'}
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
    cell: ({ row }) =>
      row.original.createdAt === '0001-01-01T00:00:00'
        ? 'Not Available'
        : new Date(row.original.createdAt).toLocaleDateString(),
    enableSorting: true,
  },
  {
    accessorKey: 'postUpvotes',
    header: 'Upvotes',
    cell: ({ row }) => row.original.postUpvotes.length,
    enableSorting: false,
  },
  {
    accessorKey: 'postDevotes',
    header: 'Downvotes',
    cell: ({ row }) => row.original.postDevotes.length,
    enableSorting: false,
  },
  {
    accessorKey: 'postComments',
    header: 'Comments',
    cell: ({ row }) => row.original.postComments.length,
    enableSorting: false,
  },
  {
    accessorKey: 'postShares',
    header: 'Shares',
    cell: ({ row }) => row.original.postShares.length,
    enableSorting: false,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Tooltip>
        <CellAction data={row.original} />
      </Tooltip>
    ),
    enableSorting: false,
    enableHiding: true,
  },
];
