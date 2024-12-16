'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import UserTable from './user-tables/user-table';
import { fetchUsers } from '@/app/admin/api/user';

export default function UserListingPage() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser) return;

    if (updatedUser.isDeleted) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== updatedUser.userId));
    } else {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === updatedUser.userId ? updatedUser : user
        )
      );
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${users.length})`}
            description="Manage users (Client-side table functionalities.)"
          />
          <Link
            href={'/admin/dashboard/user/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Link>
        </div>
        <Separator />
        <UserTable
          data={users}
          totalData={users.length}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </PageContainer>
  );
}
