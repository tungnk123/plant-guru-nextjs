'use client';

import { AlertModal } from '@/components-admin/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { Post } from '@/constants/data';
import { Check, Eye, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {approvePost} from '@/app/admin/api/post'

interface CellActionProps {
  data: Post;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    try {
      const approvedPost = await approvePost('3fa85f64-5717-4562-b3fc-2c963f66afa6');
      console.log('Approved Post:', approvedPost);
    } catch (error) {
      console.error('Error approving post');
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      console.log(`Deleting post with id: ${data.id}`);      
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleViewDetails = () => {
    router.push(`/admin/dashboard/post/${data.id}`);
  };

  return (
    <>
      {/* Confirmation Modal for Delete */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />

      <div className="flex space-x-2">
        {/* Approve Button */}
        <Button
          variant="default" // Customize this variant if needed
          size="icon" // Use "icon" size to make the button square
          onClick={handleApprove}
          disabled={loading}
        >
          <Check className="h-4 w-4" />
        </Button>

        {/* Delete Button */}
        <Button
          variant="destructive"
          size="icon" // Use "icon" size to make the button square
          onClick={() => setOpen(true)}
          disabled={loading}
        >
          <Trash className="h-4 w-4" />
        </Button>

        {/* View Details Button */}
        <Button
          variant="outline"
          size="icon" // Use "icon" size to make the button square
          onClick={handleViewDetails}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
