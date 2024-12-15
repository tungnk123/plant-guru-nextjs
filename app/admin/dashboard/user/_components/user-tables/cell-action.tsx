'use client';

import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/constants/data';
import { Crown, Eye, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { goPremium, removePremium } from '@/app/admin/api/user';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Function to promote user to premium
  const handlePromoteToPremium = async () => {
    try {
      setLoading(true);
      await goPremium(data.userId);
      toast({
        title: 'Success',
        description: `User "${data.name}" is now a premium member!`,
        variant: 'success',
      });
      router.refresh();
      setIsUpgradeDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error promoting user to premium:', error);
      toast({
        title: 'Error',
        description: 'Failed to promote user to premium. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to delete user
  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await removePremium(data.userId);
      toast({
        title: 'Success',
        description: `User "${data.name}" has been deleted.`,
        variant: 'success',
      });
      router.refresh();
      setIsDeleteDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    router.push(`/admin/dashboard/user/${data.userId}`);
  };

  return (
    <div className="flex space-x-1">
      {/* Promote to Premium Button */}
      <AlertDialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Promote to Premium"
            disabled={loading}
          >
            <Crown className="h-4 w-4 text-yellow-500 hover:text-yellow-700" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Premium</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to upgrade user "{data.name}" to premium?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpgradeDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePromoteToPremium}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Button */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            disabled={loading}
          >
            <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user "{data.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
  );
};
