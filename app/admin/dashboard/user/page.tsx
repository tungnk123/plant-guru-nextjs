import { searchParamsCache } from '@/lib/searchparams'; // Handles search params cache
import { SearchParams } from 'nuqs'; // Parses search params
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import UserListingPage from './_components/user-listing-page';

type PageProps = {
  searchParams: Promise<SearchParams>; // Treating searchParams as a Promise
};

const Page = async ({ searchParams }: PageProps) => {
  // Await the resolution of searchParams
  const resolvedSearchParams = await searchParams;

  // Parse resolved search params
  searchParamsCache.parse(resolvedSearchParams);

  return (
    <NuqsAdapter>
      <UserListingPage />
    </NuqsAdapter>
  );
};

export default Page;
