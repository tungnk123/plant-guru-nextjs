'use client';
import { AlertModal } from '@/components-admin/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { WikiCard } from '@/app/api/wikiService';
import { Edit, Trash, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface CellActionProps {
  data: WikiCard;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      // Add your delete API call here
      // await deleteWikiArticle(data.id);
      toast.success('Wiki article deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Delete Wiki Article"
        description="Are you sure you want to delete this wiki article? This action cannot be undone."
      />
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
          onClick={() => router.push(`/admin/dashboard/wiki/${data.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
          onClick={() => router.push(`/admin/dashboard/wiki/${data.id}`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
