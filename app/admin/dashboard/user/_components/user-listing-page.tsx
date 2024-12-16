'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button'; // Import ShadCN UI Button
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isPremiumFilter, setIsPremiumFilter] = useState(false);
  const [isFreeFilter, setIsFreeFilter] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers); // Initialize filtered users
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    // Filter and search logic
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (isPremiumFilter) {
      filtered = filtered.filter((user) => user.isHavePremium);
    }

    if (isFreeFilter) {
      filtered = filtered.filter((user) => !user.isHavePremium);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, isPremiumFilter, isFreeFilter, users]);

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser) return;

    if (updatedUser.isDeleted) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== updatedUser.userId)
      );
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
            title={`Users (${filteredUsers.length})`}
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
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md p-2 w-full max-w-xs"
          />

          <Button
            variant={isPremiumFilter ? 'destructive' : 'default'}
            onClick={() => {
              setIsPremiumFilter((prev) => !prev);
              if (isFreeFilter) setIsFreeFilter(false); // Turn off free filter if active
            }}
          >
            {isPremiumFilter ? 'Show All' : 'Filter Premium'}
          </Button>

          <Button
            variant={isFreeFilter ? 'destructive' : 'default'}
            onClick={() => {
              setIsFreeFilter((prev) => !prev);
              if (isPremiumFilter) setIsPremiumFilter(false); // Turn off premium filter if active
            }}
          >
            {isFreeFilter ? 'Show All' : 'Filter Free'}
          </Button>
        </div>
        <Separator />
        <UserTable
          data={filteredUsers}
          totalData={filteredUsers.length}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </PageContainer>
  );
}
