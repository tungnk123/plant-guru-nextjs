'use client';

import { AlertModal } from '@/components-admin/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { User } from '@/constants/data';
import { Star, Eye, Trash, Crown } from 'lucide-react'; // Use Star or Crown for premium icon
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handlePromoteToPremium = () => {
    console.log(`Promote to Premium action triggered for user ID: ${data.userId}`);
    // Replace this with the actual API call to update the user's premium status
  };

  const handleDelete = () => {
    console.log(`Delete action triggered for user ID: ${data.userId}`);
    setOpen(true); // Open the confirmation modal
  };

  const handleViewDetails = () => {
    console.log(`View details action triggered for user ID: ${data.userId}`);
    router.push(`/admin/dashboard/user/${data.userId}`);
  };

  return (
    <>
      {/* Confirmation Modal for Delete */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log(`Confirmed delete for user ID: ${data.userId}`);
          setOpen(false);
        }}
        loading={loading}
      />

      <div className="flex space-x-1">
        {/* Promote to Premium Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePromoteToPremium}
          aria-label="Promote to Premium"
        >
          <Crown className="h-4 w-4 text-yellow-500 hover:text-yellow-700" /> {/* Premium icon */}
        </Button>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label="Delete"
        >
          <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
        </Button>

        {/* View Details Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleViewDetails}
          aria-label="View Details"
        >
          <Eye className="h-4 w-4 text-blue-500 hover:text-blue-700" />
        </Button>
      </div>
    </>
  );
};
