'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components-admin/layout/page-container';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import MembershipService from '@/app/admin/api/membership';

export default function AddNewMembershipPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await MembershipService.createMembership({ 
        name, 
        description, 
        price: Number(price),
      });
      toast({
        title: 'Success',
        description: `Membership plan created with ID: ${data.id}`,
        variant: 'success',
      });

      router.push('/admin/dashboard/membership');
    } catch (error: any) {
      console.error('Error creating membership:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while creating the membership plan.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Heading
        title="Add New Membership Plan"
        description="Create a new membership plan by providing the required details."
      />
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Plan Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter plan name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Enter plan description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            type="button"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Membership Plan'}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
