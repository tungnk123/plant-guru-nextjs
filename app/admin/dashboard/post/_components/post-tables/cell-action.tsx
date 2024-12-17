'use client';

import { Button } from '@/components/ui/button';
import { Check, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { approvePost, unApprovePost } from '@/app/admin/api/post';

interface CellActionProps {
  data: any;
  onUpdate: () => void; // Callback to refresh the table data
}

export const CellAction: React.FC<CellActionProps> = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  // Handle Approve Action
  const handleApprove = async () => {
    setLoading(true);
    try {
      await approvePost(data.id);
      console.log(`Post approved: ${data.id}`);
      onUpdate(); 
    } catch (error) {
      console.error('Error approving post:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Unapprove Action
  const handleUnapprove = async () => {
    setLoading(true);
    try {
      await unApprovePost(data.id);
      console.log(`Post unapproved: ${data.id}`);
      onUpdate(); // Trigger a refresh
    } catch (error) {
      console.error('Error unapproving post:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="default" size="icon" onClick={handleApprove} disabled={loading}>
        <Check className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" onClick={handleUnapprove} disabled={loading}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
