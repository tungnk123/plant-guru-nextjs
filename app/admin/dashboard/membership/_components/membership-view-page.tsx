'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import PageContainer from '@/components-admin/layout/page-container';
import { useEffect, useState } from 'react';
import MembershipService, { Membership } from '@/app/admin/api/membership';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Save, FileText, DollarSign } from 'lucide-react';
import Lottie from 'react-lottie-player';
import loadingAnimation from '@/public/animations/loading.json';
import { Input } from '@/components/ui/input';

export default function MembershipViewPage({
  params,
}: {
  params: { membershipId: string };
}) {
  const { membershipId } = params;

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMembership, setEditedMembership] = useState<Membership | null>(
    null
  );

  useEffect(() => {
    async function fetchMembershipDetails() {
      setLoading(true);
      setError(null);
      try {
        console.log("id ben kia: ", membershipId)
        const membershipData = await MembershipService.getMembershipById(
          membershipId
        );
        setMembership(membershipData);
        setEditedMembership(membershipData);
      } catch (error) {
        console.error('Error fetching membership details:', error);
        setError('Failed to fetch membership details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchMembershipDetails();
  }, [membershipId]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = async () => {
    try {
      if (editedMembership) {
        const updatedMembership = await MembershipService.updateMembership(
          editedMembership
        );
        setMembership(updatedMembership);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving membership:', error);
      setError('Failed to save membership details.');
    }
  };

  const handleChange = (field: keyof Membership, value: string | number) => {
    if (editedMembership) {
      setEditedMembership({ ...editedMembership, [field]: value });
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-screen flex-col items-center justify-center">
          <Lottie
            loop
            animationData={loadingAnimation}
            play
            style={{ width: 150, height: 150 }}
          />
          <p className="mt-4 text-lg text-gray-500">
            Loading membership details...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <p className="text-red-500">{error}</p>
      </PageContainer>
    );
  }

  if (!membership) {
    return (
      <PageContainer>
        <p>Membership not found</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-100"
          onClick={handleEditToggle}
        >
          <Pencil className="h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>

        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-green-500 text-green-500 hover:bg-green-100"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-100"
          onClick={() => console.log('Delete Membership')}
        >
          <Trash2 className="h-4 w-4" />
          Delete Membership
        </Button>
      </div>

      <ScrollArea>
        <div className="space-y-6 rounded-md bg-white p-6 shadow-md">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="mr-2 h-4 w-4 text-gray-500" />
                Name
              </label>
              <Input
                type="text"
                value={editedMembership?.name || ''}
                disabled={!isEditing}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                Price
              </label>
              <Input
                type="number"
                value={editedMembership?.price || ''}
                disabled={!isEditing}
                onChange={(e) =>
                  handleChange('price', parseFloat(e.target.value))
                }
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={editedMembership?.description || ''}
                disabled={!isEditing}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </PageContainer>
  );
}
