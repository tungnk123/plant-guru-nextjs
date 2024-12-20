'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { Membership } from '@/app/admin/api/membership'; // Import Membership type
import { membershipColumns } from './membership-columns'; // Import Membership column definitions
import { useMembershipTableFilters } from './use-membership-table-filters'; // Updated filter hook
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function MembershipTable({
  data,
  totalData,
  onMembershipUpdate,
  onDeleteMembership, // Add onDeleteMembership prop
}: {
  data: Membership[];
  totalData: number;
  onMembershipUpdate: (membership: Membership) => void;
  onDeleteMembership: (id: string) => void; // Include onDeleteMembership in the type definition
}) {
  const {
    searchQuery,
    setSearchQuery,
    isAnyFilterActive,
    resetFilters,
  } = useMembershipTableFilters(); // Use updated filter hook

  return (
    <div className="space-y-4">
      {/* Filter and Search Section */}
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search memberships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-xs"
        />
        {isAnyFilterActive && (
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>

      {/* Membership Data Table */}
      <DataTable
        columns={membershipColumns(onMembershipUpdate, onDeleteMembership)} // Pass both onMembershipUpdate and onDeleteMembership
        data={data} // Pass Membership data
        totalItems={totalData}
      />
    </div>
  );
}
