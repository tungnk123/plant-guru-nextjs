import { Membership } from '@/app/admin/api/membership';
import { Trash, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CellActionProps {
  data: Membership;
  onMembershipUpdate: (membership: Membership) => void;
  onDeleteMembership: (id: string) => void; // Add onDeleteMembership prop
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  onMembershipUpdate,
  onDeleteMembership,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleViewDetails = () => {
    router.push(`/admin/dashboard/membership/${data.id}`);
  };

  const handleDeleteMembership = async () => {
    try {
      setLoading(true);
      // Call delete API
      await onDeleteMembership(data.id!);

      toast({
        title: 'Success',
        description: `Membership "${data.name}" has been deleted.`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error deleting membership:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete membership. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      {/* View Details Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleViewDetails}
        aria-label="View Details"
        disabled={loading}
      >
        <Eye className="h-4 w-4 text-blue-500 hover:text-blue-700" />
      </Button>

      {/* Delete Membership Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteMembership}
        aria-label="Delete"
        disabled={loading}
      >
        <Trash className="h-4 w-4 text-red-500 hover:text-red-700" />
      </Button>
    </div>
  );
};
