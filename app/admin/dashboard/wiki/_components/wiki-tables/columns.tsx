'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { WikiCard } from '@/app/api/wikiService';
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Users } from 'lucide-react';

export const columns: ColumnDef<WikiCard>[] = [
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
    accessorKey: 'title',
    header: 'TITLE',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.title}</div>
    )
  },
  {
    accessorKey: 'thumbnailImageUrl',
    header: 'THUMBNAIL',
    cell: ({ row }) => (
      <div className="relative w-20 h-20">
        {row.original.thumbnailImageUrl ? (
          <img
            src={row.original.thumbnailImageUrl}
            alt={row.original.title}
            className="object-cover w-full h-full rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder-plant.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: 'upvotes',
    header: 'UPVOTES',
    cell: ({ row }) => (
      <Badge variant="secondary" className="flex items-center gap-1">
        <ThumbsUp className="h-3 w-3" />
        {row.original.upvotes}
      </Badge>
    )
  },
  {
    accessorKey: 'contributorCount',
    header: 'CONTRIBUTORS',
    cell: ({ row }) => (
      <Badge variant="outline" className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {row.original.contributorCount}
      </Badge>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
