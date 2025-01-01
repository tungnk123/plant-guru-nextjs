'use client';
import React, { useEffect, useState } from 'react';
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import MembershipListingPage from './_components/membership-listing-page';
import MembershipService, { Membership } from '@/app/admin/api/membership';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  searchParamsCache.parse(resolvedSearchParams);

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await MembershipService.getMemberships();
        setMemberships(data);
      } catch (error) {
        console.error('Error fetching memberships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleMembershipUpdate = async (updatedMembership: Membership) => {
    setMemberships((prevMemberships) =>
      prevMemberships.map((membership) =>
        membership.id === updatedMembership.id ? updatedMembership : membership
      )
    );
  };

  const handleDeleteMembership = async (id: string) => {
    try {
      await MembershipService.deleteMembership(id);
      setMemberships((prevMemberships) =>
        prevMemberships.filter((membership) => membership.id !== id)
      );
    } catch (error) {
      console.error('Error deleting membership:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <NuqsAdapter>
      <MembershipListingPage
        data={memberships}
        totalData={memberships.length}
        onMembershipUpdate={handleMembershipUpdate}
        onDeleteMembership={handleDeleteMembership}
      />
    </NuqsAdapter>
  );
};

export default Page;
