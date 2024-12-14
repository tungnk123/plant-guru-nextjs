import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import UserTable from './user-tables/user-table';
import { fetchUsers } from '@/app/admin/api/user';

export default async function UserListingPage() {
  let users = [];

  try {
    users = await fetchUsers(); // Fetch user data
    console.log('Fetched Users:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${users.length})`} // Updated heading for users
            description="Manage users (Server-side table functionalities.)"
          />

          <Link
            href={'/dashboard/user/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Link>
        </div>
        <Separator />
        <UserTable data={users} totalData={users.length} />
      </div>
    </PageContainer>
  );
}
