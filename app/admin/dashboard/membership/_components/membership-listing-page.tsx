'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Membership } from '@/app/admin/api/membership';
import { membershipColumns } from './membership-tables/membership-columns';
import { DataTable } from '@/components-admin/ui/table/data-table';

type MembershipListingPageProps = {
  data: Membership[];
  totalData: number;
  onMembershipUpdate: (membership: Membership) => Promise<void>;
  onDeleteMembership: (id: string) => Promise<void>;
};

export default function MembershipListingPage({
  data,
  totalData,
  onMembershipUpdate,
  onDeleteMembership,
}: MembershipListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Membership[]>(data);

  // Filter memberships based on search query
  useEffect(() => {
    const filtered = data.filter((membership) =>
      membership.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        {/* Heading and Add New Button */}
        <div className="flex items-start justify-between">
          <Heading
            title={`Memberships (${filteredData.length})`}
            description="Manage memberships"
          />
          <Link
            href={'/admin/dashboard/membership/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search memberships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md"
          />
        </div>

        <Separator />

        {/* Membership Table */}
        <DataTable
          columns={membershipColumns(onMembershipUpdate, onDeleteMembership)}
          data={filteredData}
          totalItems={totalData}
        />
      </div>
    </PageContainer>
  );
}
